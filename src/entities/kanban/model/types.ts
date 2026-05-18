export type KanbanPriority = "low" | "medium" | "high" | "critical";

export type KanbanColumnColor = "grey" | "blue" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";

export type KanbanCard = {
	id: string;
	title: string;
	subtitle?: string;
	priority?: KanbanPriority;
};

export type KanbanColumn = {
	id: string;
	title: string;
	color: KanbanColumnColor;
	cards: KanbanCard[];
};
