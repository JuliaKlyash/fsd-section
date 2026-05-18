import { isUndefined } from "@/shared/lib";

/** Константа для тонкого пробела, используемого при форматировании чисел */
export const THIN_SPACING = "\u2009";

/**
 * Интерфейс для работы с частями числа
 */
interface NumberParts {
	integerPart: string;
	decimalPart: string;
}

/**
 * Нормализует ввод, обрабатывая различные разделители
 * @param value Введенное значение
 * @returns Нормализованное значение
 */
export const normalizeInput = (value: string): string => {
	if (!value) return "";

	// Заменяем все возможные разделители на запятую
	const normalizedValue = value.replace(/[./бю]/g, ",");

	// Если ввели только разделитель, добавляем ноль перед ним
	if ([","].includes(normalizedValue)) {
		return "0,";
	}

	return normalizedValue;
};

/**
 * Разделяет число на целую и дробную части
 * @param value Значение для разделения
 * @returns Объект с частями числа
 */
export const splitNumberParts = (value: string): NumberParts => {
	const [integerPart = "", decimalPart = ""] = value.split(",");
	return { integerPart, decimalPart };
};

/**
 * Проверяет наличие множественных нулей в начале целой части
 * @param value Значение для проверки
 * @returns true если есть лишние нули
 */
export const hasLeadingZeros = (value: string): boolean => {
	const { integerPart } = splitNumberParts(value);
	return integerPart.startsWith("0") && integerPart.length > 1 && !integerPart.startsWith("-0");
};

/**
 * Проверяет корректность вводимого значения для числового поля
 * @param value Проверяемое значение
 * @param isDecimal Флаг, указывающий является ли число десятичным
 * @returns true если значение корректно, false если нет
 */
export const isValidNumberInput = (value: string, isDecimal: boolean = false): boolean => {
	// Разрешаем пустую строку
	if (!value) return true;

	// Сначала удаляем тонкие пробелы
	const valueWithoutSpaces = value.replace(new RegExp(THIN_SPACING, "g"), "");

	// Специальная проверка для случая "0," в десятичном режиме
	if (isDecimal && valueWithoutSpaces === "0,") {
		return true;
	}

	// Регулярное выражение для проверки ввода
	const regex = isDecimal
		? /^(0|[1-9]\d*)?[,]?\d*$/ // Для decimal: разрешаем 0 или число без ведущих нулей, запятую и дробную часть
		: /^(0|[1-9]\d*)?$/; // Для integer: разрешаем 0 или число без ведущих нулей

	return regex.test(valueWithoutSpaces);
};

/**
 * Форматирует число, добавляя тонкие пробелы между разрядами
 * @param {string | number} value - Значение для форматирования
 * @returns {string} - Отформатированное значение
 *
 * Особенности:
 * - Добавляет тонкие пробелы каждые 3 разряда
 * - Сохраняет знак минуса
 * - Сохраняет десятичную часть без изменений
 * - Возвращает пустую строку для null/undefined
 */
export const formatNumberWithSpaces = (value: string | number): string => {
	if (!value && value !== 0) return "";

	const stringValue = value.toString();
	const [integerPart, decimalPart] = stringValue.split(/[.,]/);

	// Add spaces to integer part
	const reversedWithSpaces = integerPart
		.split("")
		.reverse()
		.reduce((acc, digit, index) => {
			const shouldAddSpace = index > 0 && index % 3 === 0;
			return shouldAddSpace ? `${digit}${THIN_SPACING}${acc}` : `${digit}${acc}`;
		}, "");

	return decimalPart ? `${reversedWithSpaces},${decimalPart}` : reversedWithSpaces;
};

/**
 * Очищает введенное значение от лишних символов и форматирования
 * @param {string} value - Значение для очистки
 * @returns {string} - Очищенное значение
 *
 * Выполняет:
 * - Замену точки и других разделителей на запятую
 * - Удаление всех символов кроме цифр, минуса и запятой
 * - Обработку ведущих нулей (оставляет один ноль или убирает все)
 * - Обработку множественных минусов и запятых
 * - Особую обработку для целой и дробной частей
 */
export const cleanNumberValue = (value: string): string => {
	if (!value) return "";

	// Replace dots and other decimal separators with comma
	let cleanedValue = value.replace(/[./бю]/g, ",");

	// First remove thin spaces to avoid interference
	cleanedValue = cleanedValue.replace(new RegExp(THIN_SPACING, "g"), "");

	// Clean up the value
	cleanedValue = cleanedValue
		.replace(/[^\d,]/g, "") // Remove non-digit characters except comma
		.replace(/,{2,}/g, ","); // Remove multiple commas

	// Handle empty value
	if (!cleanedValue) return "";

	// Особая обработка для десятичных чисел
	if (cleanedValue.includes(",")) {
		const [integerPart, decimalPart] = cleanedValue.split(",");
		// Обрабатываем целую часть: оставляем один 0 или убираем ведущие нули
		const cleanInteger = integerPart.replace(/^0+/, "") || "0";
		return `${cleanInteger},${decimalPart}`;
	}

	// Для целых чисел: оставляем один 0 или убираем ведущие нули
	return cleanedValue.replace(/^0+/, "") || "0";
};

/**
 * Форматирует десятичное число с указанным количеством знаков после запятой
 * @param {string} value - Значение для форматирования
 * @param {number} floor - Количество знаков после запятой (по умолчанию 2)
 * @returns {string} - Отформатированное значение
 *
 * Особенности:
 * - Округляет до указанного количества знаков
 * - Добавляет нули после запятой если нужно
 * - Форматирует целую часть с разделителями
 * - Возвращает "0,00" (или подобное) для невалидных значений
 */
export const formatDecimalValue = (value: string, floor: number = 2): string => {
	if (!value) return "";

	// Convert to standard format for calculations
	const normalizedValue = value.replace(/,/g, ".");
	const numValue = Number(normalizedValue);

	if (isNaN(numValue)) return "0," + "0".repeat(floor);

	// Round to specified decimal places
	const rounded = Number(numValue.toFixed(floor));
	const [integerPart, decimalPart = ""] = rounded.toString().split(".");

	const formattedInteger = formatNumberWithSpaces(integerPart);
	return `${formattedInteger},${decimalPart.padEnd(floor, "0")}`;
};

/**
 * Проверяет и корректирует значение согласно указанным min/max ограничениям
 * @param {string} value - Проверяемое значение
 * @param {number} min - Минимальное допустимое значение
 * @param {number} max - Максимальное допустимое значение
 * @returns {number} - Скорректированное значение
 *
 * Особенности:
 * - Преобразует строку в число
 * - Применяет ограничения min/max
 * - Возвращает min или 0 для невалидных значений
 */
export const validateNumberValue = (value: string, min?: number, max?: number): number => {
	if (!value || value === "-") return min ?? 0;

	const numberValue = Number(value.replace(/,/g, ".").replace(THIN_SPACING, ""));

	if (isNaN(numberValue)) return min ?? 0;
	if (!isUndefined(min) && numberValue < min) return min;
	if (!isUndefined(max) && numberValue > max) return max;

	return numberValue;
};

/**
 * Удаляет форматирование из строки (пробелы всех видов)
 * @param {string} value - Форматированная строка
 * @returns {string} - Строка без форматирования
 */
export const removeFormatting = (value: string): string => {
	return value.replace(new RegExp(THIN_SPACING, "g"), "").replace(/\s/g, "");
};

/**
 * Увеличивает/уменьшает значение на указанный инкремент с учетом ограничений
 * @param {string} currentValue - Текущее значение
 * @param {number} increment - Величина изменения (положительная или отрицательная)
 * @param {number} min - Минимальное допустимое значение
 * @param {number} max - Максимальное допустимое значение
 * @returns {string} - Новое значение
 */
export const incrementValue = (currentValue: string, increment: number, min?: number, max?: number): string => {
	const numValue = Number(currentValue.replace(/,/g, ".").replace(THIN_SPACING, "")) || 0;
	const newValue = numValue + increment;

	if (!isUndefined(min) && newValue < min) return min.toString();
	if (!isUndefined(max) && newValue > max) return max.toString();

	return newValue.toString();
};

/**
 * Генерирует плейсхолдер для десятичного числа
 * @param {number} floor - Количество знаков после запятой
 * @returns {string} - Строка вида "0,00" с указанным количеством нулей
 */
export const getPlaceholder = (floor: number = 2): string => {
	return `0,${"0".repeat(floor)}`;
};

/**
 * Форматирует части числа
 * @param parts Части числа
 * @param isDecimal Флаг десятичного числа
 * @param hasComma Флаг наличия запятой в исходном значении
 * @returns Отформатированное значение
 */
export const formatNumberParts = (parts: NumberParts, isDecimal: boolean, hasComma: boolean): string => {
	const { integerPart, decimalPart } = parts;

	// Очищаем целую часть от форматирования
	const cleanIntegerPart = integerPart.replace(new RegExp(THIN_SPACING, "g"), "");
	const formattedInteger = cleanIntegerPart ? formatNumberWithSpaces(cleanIntegerPart) : "";

	// Добавляем запятую только если она была в исходном значении
	if (isDecimal && hasComma) {
		return `${formattedInteger},${decimalPart}`;
	}

	return formattedInteger;
};

/**
 * Форматирует число для отображения
 * @param value Значение для форматирования
 * @param isDecimal Флаг десятичного числа
 * @returns Отформатированное значение
 */
export const formatDisplayValue = (value: string, isDecimal: boolean): string => {
	if (!value) return "";

	const normalizedValue = normalizeInput(value);
	const hasComma = normalizedValue.includes(",");
	const parts = splitNumberParts(normalizedValue);
	return formatNumberParts(parts, isDecimal, hasComma);
};
