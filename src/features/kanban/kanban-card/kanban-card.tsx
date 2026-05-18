import { Draggable } from "@hello-pangea/dnd";
import classNames from "classnames";

import { getPriorityLabel } from "@entities/kanban";
import type { KanbanCard as KanbanCardType } from "@entities/kanban";

import styles from "./kanban-card.module.scss";

type KanbanCardProps = {
	card: KanbanCardType;
	index: number;
};

/** Карточка канбана */
export function KanbanCard({ card, index }: KanbanCardProps) {
	return (
		<Draggable draggableId={card.id} index={index}>
			{(provided, snapshot) => (
				<article
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={classNames(styles.card, {
						[styles.cardDragging]: snapshot.isDragging
					})}
				>
					<h4 className={styles.title}>{card.title}</h4>
					{card.subtitle ? <p className={styles.subtitle}>{card.subtitle}</p> : null}
					{card.priority ? (
						<span className={classNames(styles.priority, styles[`priority_${card.priority}`])}>
							{getPriorityLabel(card.priority)}
						</span>
					) : null}
				</article>
			)}
		</Draggable>
	);
}
