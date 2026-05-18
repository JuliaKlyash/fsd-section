import React, { useCallback, useRef, useState } from "react";
import classNames from "classnames";


import { ScrollType, type ScrollTrackProps } from "../model/types";

import styles from "./scroll-track.module.scss";
import { useDragScroll } from "../model";

export function HorizontalScrollTrack(props: ScrollTrackProps) {
	const { scrollContentRef, contentIsHovering, scrollProperties, handleScroll } = props;
	const [scrollIsHovering, setScrollIsHovering] = useState(false);

	const { isDragging, startDragging } = useDragScroll(scrollProperties, scrollContentRef, ScrollType.Horizontal);

	// Для хранения предыдущего значения X с тачпада
	const touchState = useRef<{ prevX: number | null }>({ prevX: null });

	const horizontalScrollClasses = classNames(styles.defaultScroll, styles.horizontalScroll, {
		[styles.horizontalScrollHover]: scrollIsHovering || isDragging,
		[styles.scrollHidden]: (!contentIsHovering && !scrollIsHovering && !isDragging) || scrollProperties.size === -1
	});

	const horizontalTrackClasses = classNames(styles.horizontalScrollTrack, {
		[styles.visible]: contentIsHovering || scrollIsHovering || isDragging
	});

	const handleMouseScrollEnter = () => setScrollIsHovering(true);
	const handleMouseScrollLeave = () => setScrollIsHovering(false);

	const handleTouchMove = useCallback(
		(event: React.TouchEvent) => {
			if (scrollContentRef) {
				const touch = event.touches[0];
				const currentX = touch.clientX;

				if (touchState.current.prevX !== null) {
					const deltaX = currentX - touchState.current.prevX;
					scrollContentRef.scrollLeft -= deltaX;
					handleScroll();
				}

				touchState.current.prevX = currentX;
			}
		},
		[scrollContentRef, handleScroll]
	);

	return (
		<div
			className={horizontalTrackClasses}
			onMouseEnter={handleMouseScrollEnter}
			onMouseLeave={handleMouseScrollLeave}
			onScroll={handleScroll}
			onTouchMove={handleTouchMove} // Обработчик касаний тачпадом
		>
			<div
				className={horizontalScrollClasses}
				style={{ transform: `translateX(${scrollProperties.position}px)`, width: `${scrollProperties.size}px` }}
				onMouseDown={startDragging}
			/>
		</div>
	);
}
