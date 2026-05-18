import { moveKanbanCard } from "../move-card";

import { mockKanbanColumns } from "./test-fixtures";

describe("moveKanbanCard", () => {
	it("перемещает карточку между колонками", () => {
		const result = moveKanbanCard(
			mockKanbanColumns,
			{ droppableId: "col-new", index: 0 },
			{ droppableId: "col-done", index: 0 }
		);

		expect(result[0]?.cards.map((card) => card.id)).toEqual(["card-2"]);
		expect(result[1]?.cards.map((card) => card.id)).toEqual(["card-1", "card-3"]);
	});

	it("меняет порядок карточек внутри одной колонки", () => {
		const result = moveKanbanCard(
			mockKanbanColumns,
			{ droppableId: "col-new", index: 0 },
			{ droppableId: "col-new", index: 1 }
		);

		expect(result[0]?.cards.map((card) => card.id)).toEqual(["card-2", "card-1"]);
	});

	it("не мутирует исходные колонки", () => {
		const sourceIds = mockKanbanColumns[0]?.cards.map((card) => card.id);

		moveKanbanCard(
			mockKanbanColumns,
			{ droppableId: "col-new", index: 0 },
			{ droppableId: "col-done", index: 0 }
		);

		expect(mockKanbanColumns[0]?.cards.map((card) => card.id)).toEqual(sourceIds);
	});

	it("возвращает исходные колонки при неизвестном source", () => {
		const result = moveKanbanCard(
			mockKanbanColumns,
			{ droppableId: "unknown", index: 0 },
			{ droppableId: "col-done", index: 0 }
		);

		expect(result).toBe(mockKanbanColumns);
	});

	it("возвращает исходные колонки при несуществующем index", () => {
		const result = moveKanbanCard(
			mockKanbanColumns,
			{ droppableId: "col-new", index: 99 },
			{ droppableId: "col-done", index: 0 }
		);

		expect(result).toBe(mockKanbanColumns);
	});
});
