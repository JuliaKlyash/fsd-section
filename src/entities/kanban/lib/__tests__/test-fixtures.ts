import type { KanbanColumn } from "../../model";

export const mockKanbanColumns: KanbanColumn[] = [
	{
		id: "col-new",
		title: "Новые",
		color: "blue",
		cards: [
			{ id: "card-1", title: "ООО Ромашка", subtitle: "Иван Петров", priority: "high" },
			{ id: "card-2", title: "ТехноПром", priority: "medium" }
		]
	},
	{
		id: "col-done",
		title: "Успешно",
		color: "green",
		cards: [{ id: "card-3", title: "Бета Логистик", subtitle: "Договор подписан", priority: "low" }]
	}
];
