import { mapColumnsToGridRows } from "../map-to-grid-rows";

import { mockKanbanColumns } from "../../../kanban/lib/__tests__/test-fixtures";

describe("mapColumnsToGridRows", () => {
	it("возвращает пустой массив для пустых колонок", () => {
		expect(mapColumnsToGridRows([])).toEqual([]);
	});

	it("возвращает пустой массив, если в колонках нет карточек", () => {
		expect(
			mapColumnsToGridRows([
				{ id: "empty", title: "Пусто", color: "grey", cards: [] }
			])
		).toEqual([]);
	});

	it("разворачивает карточки всех колонок в строки грида", () => {
		const rows = mapColumnsToGridRows(mockKanbanColumns);

		expect(rows).toHaveLength(3);
		expect(rows[0]).toEqual({
			id: "card-1",
			title: "ООО Ромашка",
			subtitle: "Иван Петров",
			stage: "Новые",
			stageColor: "blue",
			priority: "high"
		});
		expect(rows[2]).toEqual({
			id: "card-3",
			title: "Бета Логистик",
			subtitle: "Договор подписан",
			stage: "Успешно",
			stageColor: "green",
			priority: "low"
		});
	});

	it("сохраняет порядок: сначала все карточки первой колонки, затем второй", () => {
		const rows = mapColumnsToGridRows(mockKanbanColumns);

		expect(rows.map((row) => row.id)).toEqual(["card-1", "card-2", "card-3"]);
	});
});
