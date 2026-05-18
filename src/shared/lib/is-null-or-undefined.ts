/**
 * Проверяет, является ли значение null или undefined.
 * @param {unknown} value - Значение для проверки.
 * @returns {boolean} Возвращает true, если значение равно null или undefined, иначе false.
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
	return value === null || value === undefined;
}

/**
 * Проверяет, является ли значение null.
 * @param {unknown} value - Значение для проверки.
 * @returns {boolean} Возвращает true, если значение равно null, иначе false.
 */
export function isNull(value: unknown): value is null {
	return value === null;
}

/**
 * Проверяет, является ли значение undefined.
 * @param {unknown} value - Значение для проверки.
 * @returns {boolean} Возвращает true, если значение равно undefined, иначе false.
 */
export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

/**
 * Проверяет, содержит ли набор аргументов хотя бы одно значение null или undefined.
 * @param {...unknown[]} args - Набор значений для проверки.
 * @returns {boolean} Возвращает true, если хотя бы один аргумент равен null или undefined, иначе false.
 */
export function isNullOrUndefinedSet(...args: Array<unknown>): boolean {
	return args.some(isNullOrUndefined);
}
