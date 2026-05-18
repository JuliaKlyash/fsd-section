import { useMemo } from "react";

import type { KanbanColumn } from "@entities/kanban";

import { ScrollContainer, ScrollContainerType } from "@shared/ui/components/scroll-container";

import { mapColumnsToGridRows } from "@entities/section";

import { SECTION_GRID_COLUMNS } from "./lib";
import { getGridColumnCellClass, getGridColumnHeaderClass, renderGridCell } from "./grid-cell";

import styles from "./section-grid.module.scss";

/**@description Группа колонок грида */
function GridColGroup() {
	return (
		<colgroup>
			{SECTION_GRID_COLUMNS.map((column) => (
				<col key={column.id} className={getGridColumnHeaderClass(column.id)} />
			))}
		</colgroup>
	);
}

type SectionGridProps = {
	columns: KanbanColumn[];
};

/** Компонент грида записей */
export function SectionGrid({ columns }: SectionGridProps) {
	const rows = useMemo(() => mapColumnsToGridRows(columns), [columns]);

	if (rows.length === 0) {
		return <div className={styles.empty}>Нет записей</div>;
	}

	return (
		<div className={styles.wrapper}>
			<table className={styles.table}>
				<GridColGroup />
				<thead>
					<tr>
						{SECTION_GRID_COLUMNS.map((column) => (
							<th key={column.id} className={getGridColumnHeaderClass(column.id)}>
								{column.title}
							</th>
						))}
					</tr>
				</thead>
			</table>
			<ScrollContainer type={ScrollContainerType.Vertical} className={styles.bodyScroll}>
				<table className={styles.table}>
					<GridColGroup />
					<tbody>
						{rows.map((row) => (
							<tr key={row.id} className={styles.row}>
								{SECTION_GRID_COLUMNS.map((column) => (
									<td key={column.id} className={getGridColumnCellClass(column.id)}>
										{renderGridCell(column.id, row)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</ScrollContainer>
		</div>
	);
}
