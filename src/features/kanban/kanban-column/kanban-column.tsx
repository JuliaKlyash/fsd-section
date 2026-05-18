import { useEffect, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import classNames from "classnames";

import type { KanbanColumn as KanbanColumnType } from "@entities/kanban";

import { ScrollContainer, ScrollContainerType } from "@shared/ui/components/scroll-container";

import { KanbanCard } from "../kanban-card";

import styles from "./kanban-column.module.scss";

type KanbanColumnProps = {
	column: KanbanColumnType;
	width: number;
	isDropDisabled?: boolean;
};

/** Колонка канбана */
export function KanbanColumn({ column, width, isDropDisabled = false }: KanbanColumnProps) {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		const animation = requestAnimationFrame(() => setEnabled(true));
		return () => cancelAnimationFrame(animation);
	}, []);

	if (!enabled) {
		return null;
	}

	return (
		<section className={styles.column} style={{ width, minWidth: width }}>
			<header className={classNames(styles.header, styles[`header_${column.color}`])}>
				<h3 className={styles.title}>{column.title}</h3>
				<span className={styles.count}>{column.cards.length}</span>
			</header>

			<Droppable droppableId={column.id} isDropDisabled={isDropDisabled}>
				{(provided, snapshot) => (
					<ScrollContainer
						type={ScrollContainerType.Vertical}
						isInnerContainer
						className={classNames(styles.cardsScroll, {
							[styles.cardsDraggingOver]: snapshot.isDraggingOver,
							[styles.cardsDropDisabled]: isDropDisabled
						})}
					>
						<div ref={provided.innerRef} {...provided.droppableProps} className={styles.cardsInner}>
							{column.cards.map((card, index) => (
								<KanbanCard key={card.id} card={card} index={index} />
							))}
							{provided.placeholder}
						</div>
					</ScrollContainer>
				)}
			</Droppable>
		</section>
	);
}
