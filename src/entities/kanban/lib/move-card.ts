import type { KanbanColumn } from "../model";

type DragLocation = {
	droppableId: string;
	index: number;
};

/** Перемещает карточку из одного столбца в другой */
export function moveKanbanCard(columns: KanbanColumn[], source: DragLocation, destination: DragLocation): KanbanColumn[] {
	const next = columns.map((column) => ({ ...column, cards: [...column.cards] }));
	const sourceColumn = next.find((column) => column.id === source.droppableId);
	const destinationColumn = next.find((column) => column.id === destination.droppableId);

	if (!sourceColumn || !destinationColumn) {
		return columns;
	}

	const [movedCard] = sourceColumn.cards.splice(source.index, 1);

	if (!movedCard) {
		return columns;
	}

	destinationColumn.cards.splice(destination.index, 0, movedCard);

	return next;
}
