
import { SECTION_GRID_COLUMN_IDS, SECTION_GRID_COLUMNS } from "../grid-columns";

describe("SECTION_GRID_COLUMNS", () => {
	it("содержит четыре колонки в ожидаемом порядке", () => {
		expect(SECTION_GRID_COLUMNS.map((column) => column.id)).toEqual([...SECTION_GRID_COLUMN_IDS]);
	});

	it("имеет уникальные id колонок", () => {
		const ids = SECTION_GRID_COLUMNS.map((column) => column.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("у каждой колонки задан непустой заголовок", () => {
		for (const column of SECTION_GRID_COLUMNS) {
			expect(column.title.trim().length).toBeGreaterThan(0);
		}
	});
});
