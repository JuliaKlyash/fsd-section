import type { KanbanPriority } from "../model";

const PRIORITY_LABELS: Record<KanbanPriority, string> = {
	low: "Низкий",
	medium: "Средний",
	high: "Высокий",
	critical: "Критичный"
};

export function getPriorityLabel(priority?: KanbanPriority): string {
	if (!priority) return "—";
	return PRIORITY_LABELS[priority];
}
