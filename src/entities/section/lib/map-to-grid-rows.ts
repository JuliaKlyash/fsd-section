import type { KanbanColumn, KanbanPriority } from "@entities/kanban";

export type SectionGridRow = {
	id: string;
	title: string;
	subtitle?: string;
	stage: string;
	stageColor: KanbanColumn["color"];
	priority?: KanbanPriority;
};

export function mapColumnsToGridRows(columns: KanbanColumn[]): SectionGridRow[] {
	return columns.flatMap((column) =>
		column.cards.map((card) => ({
			id: card.id,
			title: card.title,
			subtitle: card.subtitle,
			stage: column.title,
			stageColor: column.color,
			priority: card.priority
		}))
	);
}
