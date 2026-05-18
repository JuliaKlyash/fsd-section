import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ValidateOn = Array<"change" | "blur" | "submit">;
export type ValidatorFn<TValue> = (value: TValue) => string | null | undefined;

type UseFieldValidationParams<TValue> = {
	value: TValue;
	validators?: ValidatorFn<TValue>[];
	validateOn?: Array<"change" | "blur" | "submit">;
	isError?: boolean;
	onChange: (value: TValue) => void;
	onBlur?: () => void;
	onKeyDown?: (event?: React.KeyboardEvent<HTMLDivElement>) => void;
};

/**
 * Унифицированная валидация для UI-kit `Field`.
 *
 * Контракт:
 * - validators: список функций (value -> string|null|undefined)
 * - validateOn: когда запускать валидацию (`change`/`blur`/`submit`)
 * - хук влияет только на `isError`, но не на значение (не трансформирует input)
 *
 * Маппинг `submit`:
 * - в UI-kit нет общего события "submit"
 * - поэтому `submit` триггерится при нажатии Enter в `onKeyDown`
 */
export function useFieldValidation<TValue>({
	value,
	validators,
	validateOn,
	isError,
	onChange,
	onBlur,
	onKeyDown
}: UseFieldValidationParams<TValue>) {
	const [validationError, setValidationError] = useState<string | null>(null);
	// Сохраняем последнее значение, чтобы:
	// - при onBlur/Enter валидировать актуальный value
	// - избегать проблем с устаревшими closure’ами
	const lastValueRef = useRef<TValue>(value);

	// Политика запуска валидаторов.
	const effectiveValidateOn: ValidateOn = validateOn ?? ["change", "blur"];

	/**
	 * Запускает валидаторы и обновляет `validationError`.
	 *
	 * Берём первую ошибку (first error), чтобы пользователь видел один понятный текст.
	 * Если валидаторы не заданы или вернули null/undefined — ошибок нет.
	 */
	const runValidation = useCallback(
		(nextValue: TValue) => {
			if (!validators || validators.length === 0) {
				setValidationError(null);
				return;
			}

			const firstError = validators.map((v) => v(nextValue)).find((res) => Boolean(res)) ?? null;

			if (firstError == null) {
				setValidationError(null);
				return;
			}

			setValidationError(typeof firstError === "string" ? firstError : "Ошибка");
		},
		[validators]
	);

	// Когда внешнее `value` меняется:
	// - обновляем `lastValueRef`
	// - при validateOn.includes("change") также запускаем валидаторы
	useEffect(() => {
		lastValueRef.current = value;
		if (validators && validators.length && effectiveValidateOn.includes("change")) {
			runValidation(value);
		}
	}, [value, validators, effectiveValidateOn, runValidation]);

	/**
	 * Обёртка для onChange:
	 * 1) обновляет lastValueRef
	 * 2) валидирует на "change" (если разрешено validateOn)
	 * 3) пробрасывает наружу внешний onChange
	 */
	const wrappedOnChange = useCallback(
		(nextValue: TValue) => {
			lastValueRef.current = nextValue;
			if (validators && validators.length && effectiveValidateOn.includes("change")) {
				runValidation(nextValue);
			}
			onChange(nextValue);
		},
		[onChange, validators, effectiveValidateOn, runValidation]
	);

	/**
	 * Обёртка для onBlur:
	 * - валидирует на blur (если разрешено validateOn)
	 * - затем вызывает внешний onBlur
	 */
	const wrappedOnBlur = useCallback(() => {
		if (validators && validators.length && effectiveValidateOn.includes("blur")) {
			runValidation(lastValueRef.current);
		}
		onBlur?.();
	}, [onBlur, validators, effectiveValidateOn, runValidation]);

	/**
	 * Обёртка для onKeyDown:
	 * - если включено validateOn.includes("submit"), валидируем на Enter
	 * - затем пробрасываем внешний onKeyDown
	 */
	const wrappedOnKeyDown = useCallback(
		(event?: React.KeyboardEvent<HTMLDivElement>) => {
			if (event && validators && validators.length && effectiveValidateOn.includes("submit")) {
				const isEnter = event.key === "Enter" || event.code === "Enter";
				if (isEnter) {
					runValidation(lastValueRef.current);
				}
			}

			onKeyDown?.(event);
		},
		[onKeyDown, validators, effectiveValidateOn, runValidation]
	);

	const computedIsError = Boolean(isError) || Boolean(validationError);

	return {
		computedIsError,
		wrappedOnChange,
		wrappedOnBlur,
		wrappedOnKeyDown
	};
}

