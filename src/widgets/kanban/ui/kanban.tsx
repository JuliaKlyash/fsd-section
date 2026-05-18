import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

import { moveKanbanCard } from "@entities/kanban";
import type { KanbanColumn } from "@entities/kanban";

import { KanbanColumn as KanbanColumnView } from "@features/kanban/kanban-column";

import { ScrollContainer, ScrollContainerType } from "@shared/ui/components/scroll-container";

import { getColumnWidth } from "../lib";
import { MAX_COLUMN_FOR_ADAPTATION_WIDTH } from "../model/constants";

import styles from "./kanban.module.scss";

type KanbanProps = {
	initialColumns: KanbanColumn[];
};

/**
 * @description Компонент канбана для отображения колонок с карточками 
 * Поддерживает логику днд
*/
export function Kanban({ initialColumns }: KanbanProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
	const [columnWidth, setColumnWidth] = useState(300);

	useEffect(() => {
		setColumns(initialColumns);
	}, [initialColumns]);

	const updateColumnWidth = useCallback(() => {
		const containerWidth = containerRef.current?.getBoundingClientRect().width;

		if (!containerWidth || columns.length > MAX_COLUMN_FOR_ADAPTATION_WIDTH) {
			return;
		}

		setColumnWidth(getColumnWidth(containerWidth, columns.length));
	}, [columns.length]);

	useEffect(() => {
		updateColumnWidth();
		window.addEventListener("resize", updateColumnWidth);

		return () => window.removeEventListener("resize", updateColumnWidth);
	}, [updateColumnWidth]);

	const handleDragEnd = useCallback((result: DropResult) => {
		const { destination, source } = result;

		if (!destination) {
			return;
		}

		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		setColumns((prev) =>
			moveKanbanCard(prev, { droppableId: source.droppableId, index: source.index }, { droppableId: destination.droppableId, index: destination.index })
		);
	}, []);

	return (
		<ScrollContainer type={ScrollContainerType.Horizontal} className={styles.kanbanScroll} withMouseDrag>
			<div ref={containerRef} className={styles.board}>
				<DragDropContext onDragEnd={handleDragEnd}>
					{columns.map((column) => (
						<KanbanColumnView key={column.id} column={column} width={columnWidth} />
					))}
				</DragDropContext>
			</div>
		</ScrollContainer>
	);
}
