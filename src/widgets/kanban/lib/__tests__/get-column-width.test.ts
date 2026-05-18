
import { COLUMNS_GAP, MIN_WIDTH_COLUMN, PADDINGS_COUNT } from "../../model/constants";
import { getColumnWidth } from "../get-column-width";

describe("getColumnWidth", () => {
	it("делит доступную ширину поровну между колонками", () => {
		const columnCount = 4;
		const padding = 8;
		const containerWidth = 1400;
		const expected =
			(containerWidth - PADDINGS_COUNT * padding - (columnCount - 1) * COLUMNS_GAP) / columnCount;

		expect(getColumnWidth(containerWidth, columnCount, padding)).toBe(expected);
	});

	it("возвращает минимальную ширину, если колонок слишком много", () => {
		expect(getColumnWidth(400, 4)).toBe(MIN_WIDTH_COLUMN);
	});

	it("возвращает минимальную ширину при нулевом числе колонок", () => {
		expect(getColumnWidth(1200, 0)).toBe(MIN_WIDTH_COLUMN);
	});

	it("использует padding по умолчанию (0)", () => {
		const columnCount = 2;
		const containerWidth = 700;
		const expected = (containerWidth - (columnCount - 1) * COLUMNS_GAP) / columnCount;

		expect(getColumnWidth(containerWidth, columnCount)).toBe(expected);
	});
});
