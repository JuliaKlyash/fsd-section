import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import {
	formatNumberWithSpaces,
	cleanNumberValue,
	formatDecimalValue,
	validateNumberValue,
	removeFormatting,
	incrementValue,
	getPlaceholder,
	isValidNumberInput,
	normalizeInput,
	hasLeadingZeros,
	formatDisplayValue,
	THIN_SPACING
} from "./number-utils";

import { Locker } from "@/shared/ui/icons/locker";
import { isNullOrUndefined } from "@/shared/lib";

import styles from "../../fields.module.scss";
import type { BaseNumberProps } from "../fields";

/**
 * Компонент числового поля ввода
 *
 * @component
 * @param {BaseNumberProps} props - Свойства компонента
 *
 * Функциональность:
 * - Поддерживает ввод целых и десятичных чисел
 * - Автоматическое форматирование с разделителями разрядов
 * - Валидация min/max значений
 * - Поддержка отрицательных чисел
 * - Автоматическая конвертация разделителей (точка/запятая)
 * - Корректная обработка ведущих нулей
 * - Форматирование при потере фокуса
 *
 * Особенности работы:
 * - Использует тонкие пробелы для разделения разрядов
 * - Поддерживает копирование/вставку
 * - Предотвращает ввод некорректных символов
 * - Сохраняет позицию курсора при вводе
 * - Поддерживает управление стрелками вверх/вниз
 */
export function NumberField(props: BaseNumberProps) {
	/**
	 * Состояние отображаемого значения (с форматированием)
	 */
	const [visualValue, setVisualValue] = useState<string>("");

	/**
	 * Состояние фокуса поля
	 */
	const [fieldIsFocused, setFieldIsFocused] = useState(false);

	/**
	 * Состояние реального значения (без форматирования)
	 */
	const [rawValue, setRawValue] = useState<string>("");

	/**
	 * Ссылка на DOM-элемент input
	 */
	const inputRef = useRef<HTMLInputElement>(null);

	/**
	 * Ссылка на текущую позицию курсора
	 */
	const cursorPositionRef = useRef<number>(0);

	const fieldClasses = classNames(styles.fieldWrap, styles.defaultFieldWrap, styles[`${props.size}Field`], {
		[`${styles.defaultPlaceholder}`]: isNullOrUndefined(props.value) || props.value?.length === 0,
		[`${styles.disabledField}`]: props.isDisabled,
		[`${styles.fieldFocused}`]: fieldIsFocused,
		[styles.errorField]: props.isError
	});

	const inputClasses = classNames(styles.input, styles[`${props.size}Input`], styles[props.size]);
	const lockerClasses = classNames(styles.lockerButton);

	/**
	 * Восстанавливает позицию курсора с учетом форматирования
	 *
	 * Функция учитывает добавление/удаление разделителей разрядов при форматировании
	 * и корректирует позицию курсора соответственно. Это обеспечивает естественное
	 * поведение курсора при редактировании числа.
	 *
	 * Алгоритм работы:
	 * 1. Подсчитывает количество разделителей до позиции курсора в старом значении
	 * 2. Подсчитывает количество разделителей до той же позиции в новом значении
	 * 3. Вычисляет разницу в количестве разделителей
	 * 4. Корректирует позицию курсора с учетом этой разницы
	 * 5. Использует requestAnimationFrame для надежного обновления позиции после рендера
	 *
	 * @param oldValue - Значение поля до форматирования
	 * @param newValue - Значение поля после форматирования
	 * @param oldPosition - Позиция курсора до форматирования
	 *
	 * Пример:
	 * Старое значение: "1234567", курсор после "4" (позиция 4)
	 * Новое значение: "1 234 567", курсор должен быть после "4" (позиция 5)
	 */
	const restoreCursorPosition = useCallback((oldValue: string, newValue: string, oldPosition: number) => {
		if (!inputRef.current) return;

		// Считаем количество разделителей до позиции курсора в старом значении
		const oldSpacesBeforeCursor = (oldValue.slice(0, oldPosition).match(new RegExp(THIN_SPACING, "g")) || []).length;

		// Считаем количество разделителей до той же позиции в новом значении
		const newSpacesBeforeCursor = (newValue.slice(0, oldPosition).match(new RegExp(THIN_SPACING, "g")) || []).length;

		// Корректируем позицию курсора с учетом разницы в количестве разделителей
		const spaceDiff = newSpacesBeforeCursor - oldSpacesBeforeCursor;
		const newPosition = oldPosition + spaceDiff;

		// Устанавливаем курсор в правильную позицию
		requestAnimationFrame(() => {
			inputRef.current?.setSelectionRange(newPosition, newPosition);
		});
	}, []);

	/**
	 * Обработчик изменения значения
	 *
	 * Выполняет:
	 * - Валидацию значения
	 * - Применение min/max ограничений
	 * - Форматирование согласно типу (целое/десятичное)
	 */
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (props.isDisabled) return;

			const input = event.target;
			const value = input.value;
			const oldValue = visualValue;
			const cursorPosition = input.selectionStart || 0;

			// Сохраняем позицию курсора до форматирования
			cursorPositionRef.current = cursorPosition;

			// Сначала нормализуем значение
			const normalizedValue = normalizeInput(value);

			// Проверяем, является ли ввод допустимым
			if (!isValidNumberInput(normalizedValue, props.subType === "decimal")) {
				return;
			}

			// Проверяем попытку ввода лишних нулей в целой части
			if (hasLeadingZeros(normalizedValue)) {
				return;
			}

			// Очищаем значение от форматирования
			const cleanValue = cleanNumberValue(normalizedValue);

			// Если значение пустое, сбрасываем состояние
			if (!cleanValue) {
				setVisualValue("");
				setRawValue("");
				props.onChange("");
				return;
			}

			setRawValue(cleanValue);
			props.onChange(cleanValue);

			// Форматируем значение для отображения
			const formattedValue = formatDisplayValue(normalizedValue, props.subType === "decimal");
			setVisualValue(formattedValue);

			// Восстанавливаем позицию курсора после форматирования
			restoreCursorPosition(oldValue, formattedValue, cursorPosition);
		},
		[props.isDisabled, props.onChange, props.subType, visualValue, restoreCursorPosition]
	);

	/**
	 * Обработчик получения фокуса
	 */
	const handleFocus = useCallback(() => {
		setFieldIsFocused(true);
	}, []);

	/**
	 * Обработчик потери фокуса
	 */
	const handleBlur = useCallback(() => {
		setFieldIsFocused(false);

		// Если значение пустое и не передан min, не форматируем его
		if (!rawValue && !props.min) {
			setVisualValue("");
			props.onChange("");
			props.onBlur?.();
			return;
		}

		const currentValue = removeFormatting(rawValue);
		const validatedValue = validateNumberValue(currentValue, props.min, props.max).toString();

		if (props.subType === "decimal") {
			const formattedValue = formatDecimalValue(validatedValue, props.floor);
			setVisualValue(formattedValue);
			setRawValue(formattedValue);
			props.onChange(formattedValue);
		} else {
			const formattedValue = formatNumberWithSpaces(validatedValue);
			setVisualValue(formattedValue);
			setRawValue(validatedValue);
			props.onChange(validatedValue);
		}

		props.onBlur?.();
	}, [rawValue, props.min, props.max, props.subType, props.floor, props.onChange, props.onBlur]);

	/**
	 * Обработчик нажатия клавиш
	 * Поддерживает:
	 * - Увеличение/уменьшение значения стрелками
	 * - Соблюдение min/max ограничений
	 */
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				event.preventDefault();
				const increment = event.key === "ArrowUp" ? 1 : -1;
				const currentValue = removeFormatting(rawValue || visualValue);
				const newValue = incrementValue(currentValue, increment, props.min, props.max);

				setRawValue(newValue);
				props.onChange(newValue);

				const formattedValue = formatNumberWithSpaces(newValue);
				setVisualValue(formattedValue);
			}

			props.onKeyDown?.(event);
		},
		[rawValue, visualValue, props.min, props.max, props.onChange, props.onKeyDown]
	);

	/**
	 * Обработчик копирования
	 * Копирует значение без форматирования
	 */
	const handleCopy = useCallback(
		(event: React.ClipboardEvent<HTMLInputElement>) => {
			event.preventDefault();
			const cleanValue = removeFormatting(rawValue);
			event.clipboardData?.setData("text/plain", cleanValue);
		},
		[rawValue]
	);

	/**
	 * Обработчик вставки
	 * Выполняет:
	 * - Валидацию вставляемого значения
	 * - Очистку и форматирование
	 */
	const handlePaste = useCallback(
		(event: React.ClipboardEvent<HTMLInputElement>) => {
			event.preventDefault();
			const pasteData = event.clipboardData.getData("Text");

			// Проверяем, является ли вставляемое значение допустимым
			if (!isValidNumberInput(pasteData, props.subType === "decimal")) {
				return;
			}

			const cleanValue = cleanNumberValue(pasteData);
			setRawValue(cleanValue);
			props.onChange(cleanValue);

			const formattedValue = formatNumberWithSpaces(cleanValue);
			setVisualValue(formattedValue);
		},
		[props.onChange, props.subType]
	);

	/**
	 * Эффект инициализации и обновления значения
	 * Обеспечивает:
	 * - Начальное форматирование
	 * - Обновление при изменении props.value
	 * - Корректную обработку пустых значений
	 */
	useEffect(() => {
		if (!props.value) {
			setVisualValue("");
			setRawValue("");
			return;
		}

		const cleanValue = cleanNumberValue(props.value);
		setRawValue(cleanValue);
		setVisualValue(formatDisplayValue(cleanValue, props.subType === "decimal"));
	}, [props.value, props.subType]);

	const placeholder = useMemo(() => {
		if (props.subType === "decimal") {
			return getPlaceholder(props.floor);
		}
		return props.placeholder;
	}, [props.subType, props.floor, props.placeholder]);

	return (
		<div className={fieldClasses}>
			<input
				id={props.id}
				ref={inputRef}
				value={visualValue}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				onCopy={handleCopy}
				onPaste={handlePaste}
				onSelect={(e) => {
					cursorPositionRef.current = (e.target as HTMLInputElement).selectionStart || 0;
				}}
				onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
				placeholder={placeholder}
				disabled={props.isDisabled}
				className={inputClasses}
			/>
			{props.isDisabled && <Locker size='16' className={lockerClasses} />}
		</div>
	);
}
