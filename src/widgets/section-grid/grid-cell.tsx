import classNames from "classnames";
import type { ReactNode } from "react";

import { getPriorityLabel } from "@entities/kanban";
import type { KanbanColumnColor, KanbanPriority } from "@entities/kanban";
import type { SectionGridRow } from "@entities/section";

import type { SectionGridColumnId } from "./lib";

import styles from "./section-grid.module.scss";

const STAGE_COLOR_CLASS: Record<KanbanColumnColor, string> = {
	grey: styles.stageGrey,
	blue: styles.stageBlue,
	green: styles.stageGreen,
	orange: styles.stageOrange,
	pink: styles.stagePink,
	purple: styles.stagePurple,
	red: styles.stageRed,
	yellow: styles.stageYellow
};

const PRIORITY_CLASS: Record<KanbanPriority, string> = {
	low: styles.priorityLow,
	medium: styles.priorityMedium,
	high: styles.priorityHigh,
	critical: styles.priorityCritical
};

const COLUMN_CELL_CLASS: Record<SectionGridColumnId, string> = {
	title: styles.cellTitle,
	subtitle: styles.cellSubtitle,
	stage: styles.cellStage,
	priority: styles.cellPriority
};

const COLUMN_HEADER_CLASS: Record<SectionGridColumnId, string> = {
	title: styles.colTitle,
	subtitle: styles.colSubtitle,
	stage: styles.colStage,
	priority: styles.colPriority
};

export function getGridColumnHeaderClass(columnId: SectionGridColumnId): string {
	return COLUMN_HEADER_CLASS[columnId];
}

export function getGridColumnCellClass(columnId: SectionGridColumnId): string {
	return COLUMN_CELL_CLASS[columnId];
}

export function renderGridCell(columnId: SectionGridColumnId, row: SectionGridRow): ReactNode {
	switch (columnId) {
		case "title":
			return row.title;
		case "subtitle":
			return row.subtitle ?? "—";
		case "stage":
			return (
				<span className={classNames(styles.stageBadge, STAGE_COLOR_CLASS[row.stageColor])}>
					{row.stage}
				</span>
			);
		case "priority":
			return row.priority ? (
				<span className={classNames(styles.priorityBadge, PRIORITY_CLASS[row.priority])}>
					{getPriorityLabel(row.priority)}
				</span>
			) : (
				"—"
			);
		default:
			return null;
	}
}
