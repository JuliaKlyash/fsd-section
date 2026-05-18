import React, { useCallback, useState, useRef } from "react";
import classNames from "classnames";

import { ScrollType, type ScrollTrackProps } from "../model/types";
import { useDragScroll } from "../model";

import styles from "./scroll-track.module.scss";

interface VerticalScrollTrackProps extends ScrollTrackProps {
	onReachedBottom?: () => void;
}

export function VerticalScrollTrack(props: VerticalScrollTrackProps) {
	const { scrollContentRef, contentIsHovering, scrollProperties, onReachedBottom, handleScroll } = props;
	const [scrollIsHovering, setScrollIsHovering] = useState(false);

	const { isDragging, startDragging } = useDragScroll(scrollProperties, scrollContentRef, ScrollType.Vertical, onReachedBottom);

	// Для хранения предыдущего значения Y с тачпада
	const touchState = useRef<{ prevY: number | null }>({ prevY: null });

	const verticalScrollClasses = classNames(styles.defaultScroll, styles.verticalScroll, {
		[styles.verticalScrollHover]: scrollIsHovering || isDragging,
		[styles.scrollHidden]: (!contentIsHovering && !scrollIsHovering && !isDragging) || scrollProperties.size === -1
	});

	const verticalTrackClasses = classNames(styles.verticalScrollTrack, {
		[styles.visible]: contentIsHovering || scrollIsHovering || isDragging
	});

	const handleMouseScrollEnter = () => setScrollIsHovering(true);
	const handleMouseScrollLeave = () => setScrollIsHovering(false);

	const handleWheel = useCallback(
		(event: React.WheelEvent) => {
			if (scrollContentRef) {
				scrollContentRef.scrollTop += event.deltaY;
				handleScroll();
			}
		},
		[scrollContentRef, handleScroll]
	);

	const handleTouchMove = useCallback(
		(event: React.TouchEvent) => {
			if (scrollContentRef) {
				const touch = event.touches[0];
				const currentY = touch.clientY;

				if (touchState.current.prevY !== null) {
					const deltaY = currentY - touchState.current.prevY;
					scrollContentRef.scrollTop += deltaY;
					handleScroll();
				}

				touchState.current.prevY = currentY;
			}
		},
		[scrollContentRef, handleScroll]
	);

	return (
		<div
			className={verticalTrackClasses}
			onMouseEnter={handleMouseScrollEnter}
			onMouseLeave={handleMouseScrollLeave}
			onWheel={handleWheel}
			onTouchMove={handleTouchMove} // Обработчик касаний тачпадом
		>
			<div
				className={verticalScrollClasses}
				style={{ transform: `translateY(${scrollProperties.position}px)`, height: `${scrollProperties.size}px` }}
				onMouseDown={startDragging}
			/>
		</div>
	);
}
