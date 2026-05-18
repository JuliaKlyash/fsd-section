import type { KanbanColumn } from "@entities/kanban";

export type Section = {
	id: string;
	title: string;
	entityName: string;
	rowCount: number;
	kanbanIsEnabled: boolean;
	columns: KanbanColumn[];
};
