import React, { useMemo, useRef, type HTMLAttributes } from "react";
import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { v4 } from "uuid";

import { isNull } from "@/shared/lib";

import styles from "./hint.module.scss";

export type HintPosition = "top" | "right" | "bottom" | "left";

const positionPriorities = ["bottom", "left", "top", "right"];

const MARGIN_FROM_HINT = 4;

export interface HintProps extends HTMLAttributes<HTMLElement> {
	hintBody: string;
	isHintDisplayed?: boolean;
	startPosition?: HintPosition;
	isLargeSize?: boolean;
}

/**
 * @description Hint - подсказка
 * @param props.hintBody - текст подсказки
 * @param props.isHintDisplayed - флаг, отвечающий за появление подсказки по условию
 * @param props.startPosition - стартовое положение подсказки. Задается дизайнерами, но по дефолту - top.
 * @param props.usePortal - флаг, отвечающий за рендеринг подсказки через портал
 * @returns
 */
export function Hint(props: HintProps) {
	const [id] = useState<string>(v4());
	const ref = useRef<HTMLDivElement | null>(null);
	const hintRef = useRef<HTMLSpanElement | null>(null);
	const isHoverOnHint = useRef<boolean>(false);

	const [isHintVisible, setHintVisible] = useState<boolean>(false);

	const startPosition = useMemo(() => props.startPosition ?? "top", [props.startPosition]);

	/**
	 * @description Обработчик скрытия хинта
	 */
	const hideHint = useCallback(() => {
		isHoverOnHint.current = false;
		setHintVisible(false);
	}, []);

	/**
	 * @description Обработчик событий для скрытия хинта
	 */
	const handleHideEvent = useCallback(
		(e?: Event) => {
			e?.stopPropagation();
			hideHint();
		},
		[hideHint]
	);

	/**
	 * @description Обработчик клавиш навигации
	 */
	const handleKeyPress = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageUp" || e.key === "PageDown") {
				handleHideEvent(e);
			}
		},
		[handleHideEvent]
	);

	/**
	 * @description Подписка на события скрытия хинта
	 */
	useEffect(() => {
		if (!isHintVisible) return;

		document.addEventListener("wheel", handleHideEvent);
		document.addEventListener("keydown", handleKeyPress);
		document.addEventListener("scroll", hideHint, { capture: true });
		document.addEventListener("mousedown", hideHint, { capture: true });

		return () => {
			document.removeEventListener("wheel", handleHideEvent);
			document.removeEventListener("keydown", handleKeyPress);
			document.removeEventListener("scroll", hideHint, { capture: true });
			document.removeEventListener("mousedown", hideHint, { capture: true });
		};
	}, [isHintVisible, handleHideEvent, handleKeyPress, hideHint]);

	/**
	 * @description Обработка изменения размера окна
	 */
	useEffect(() => {
		const handleResize = () => defineNewPosition(startPosition);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [startPosition]);

	const defineNewPosition = useCallback(
		(position: string, depth = 0) => {
			if (depth > positionPriorities.length) {
				// обошли все возможные позиции
				return;
			}

			const parentRect = ref.current?.getBoundingClientRect();
			if (!hintRef.current || !parentRect || !isHoverOnHint.current) {
				return;
			}

			let hintWrapperRect = hintRef.current.getBoundingClientRect();

			const displayedPosition = positioningOnScreen(position, hintWrapperRect, parentRect);
			if (displayedPosition) {
				hintRef.current.style.x = displayedPosition.x + "px";
				hintRef.current.style.y = displayedPosition.y + "px";
				hintRef.current.style.left = displayedPosition.x + "px";
				hintRef.current.style.top = displayedPosition.y + "px";

				hintWrapperRect = hintRef.current.getBoundingClientRect();
			}

			if (isHoverOnHint.current && isCurrentPositionCorrect(hintWrapperRect)) {
				setHintVisible(true);
				isHoverOnHint.current = false;
				return;
			}

			const indexPriorityPosition = positionPriorities.findIndex((positionPriority) => positionPriority === position);
			const before = positionPriorities.slice(0, indexPriorityPosition + 1);
			const newPositionPriorities = positionPriorities.slice(indexPriorityPosition + 1).concat(before);

			let newPosition: string | null = null;
			newPositionPriorities.forEach((positionPriority) => {
				if (newPosition === null && isNewPositionCorrect(positionPriority, hintWrapperRect, parentRect)) {
					newPosition = positionPriority;
				}
			});

			if (!isNull(newPosition)) {
				defineNewPosition(newPosition, depth + 1);
			}
		},
		[id]
	);

	const isCurrentPositionCorrect = useCallback(
		(newHintRect?: DOMRect): boolean => {
			const hintRect = newHintRect ?? hintRef.current?.getBoundingClientRect();
			if (!hintRect) {
				return false;
			}

			const isHintWrapperHidesUp = hintRect.top < 0;
			const isHintWrapperHidesLeft = hintRect.left < 0;
			const isHintWrapperHidesDown = hintRect.bottom > window.innerHeight;
			const isHintWrapperHidesRight = hintRect.right > window.innerWidth;

			return !isHintWrapperHidesUp && !isHintWrapperHidesLeft && !isHintWrapperHidesDown && !isHintWrapperHidesRight;
		},
		[hintRef.current, window.innerHeight, window.innerWidth]
	);

	const isNewPositionCorrect = useCallback(
		(positionPriority: string, hintWrapperRect: DOMRect, parentRect: DOMRect) => {
			switch (positionPriority) {
				case "top":
					return parentRect.top - hintWrapperRect.height > 0;
				case "left":
					return parentRect.left - hintWrapperRect.width > 0;
				case "bottom":
					return hintWrapperRect.height + parentRect.bottom < window.innerHeight;
				case "right":
					return hintWrapperRect.width + parentRect.right < window.innerWidth;
			}
		},
		[window.innerHeight, window.innerWidth]
	);

	const positioningOnScreen = useCallback((positionPriority: string, hintWrapperRect: DOMRect, parentRect: DOMRect) => {
		let coordinateY: number | null = null;
		let coordinateX: number | null = null;

		switch (positionPriority) {
			case "top":
				coordinateY = parentRect.top - MARGIN_FROM_HINT - hintWrapperRect.height;
				coordinateX = parentRect.x + (parentRect.width / 2 - hintWrapperRect.width / 2);
				break;
			case "left":
				coordinateY = parentRect.y + (parentRect.height / 2 - hintWrapperRect.height / 2);
				coordinateX = parentRect.x - MARGIN_FROM_HINT - hintWrapperRect.width;
				break;
			case "bottom":
				coordinateY = parentRect.bottom + MARGIN_FROM_HINT;
				coordinateX = parentRect.x + (parentRect.width / 2 - hintWrapperRect.width / 2);
				break;
			case "right":
				coordinateY = parentRect.y + (parentRect.height / 2 - hintWrapperRect.height / 2);
				coordinateX = parentRect.right + MARGIN_FROM_HINT;
				break;
		}

		if (isNull(coordinateY) || isNull(coordinateX)) {
			return null;
		}
		return {
			y: coordinateY,
			x: coordinateX
		};
	}, []);

	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.stopPropagation();
			if (isHoverOnHint.current || isHintVisible) {
				return;
			}

			isHoverOnHint.current = true;
			defineNewPosition(startPosition);
		},
		[isHoverOnHint.current, isHintVisible, startPosition]
	);

	const handleMouseLeave = useCallback(() => {
		hideHint();
	}, [hideHint]);

	if (props.isHintDisplayed === false) {
		return <>{props.children}</>;
	}


	return (
		<div
			id={id}
			key={id}
			className={classNames(styles.hintWrapper, props.className)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={ref}
		>
			{props.children}
		</div>
	);
}
