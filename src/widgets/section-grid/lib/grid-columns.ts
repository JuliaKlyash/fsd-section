export const SECTION_GRID_COLUMN_IDS = ["title", "subtitle", "stage", "priority"] as const;

export type SectionGridColumnId = (typeof SECTION_GRID_COLUMN_IDS)[number];

export type SectionGridColumnConfig = {
	id: SectionGridColumnId;
	title: string;
};

export const SECTION_GRID_COLUMNS: SectionGridColumnConfig[] = [
	{ id: "title", title: "Название" },
	{ id: "subtitle", title: "Описание" },
	{ id: "stage", title: "Стадия" },
	{ id: "priority", title: "Приоритет" }
];
