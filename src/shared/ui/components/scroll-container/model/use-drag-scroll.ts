import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { debounce } from "@/shared/lib";

import { ScrollType, type ScrollProperties } from "./types";


/**@description хук для реализации перетаскивания для скролла контейнера.
 * @param {ScrollProperties} scrollProperties - Объект, содержащий свойства скролла (позиция, размер и метод для установки позиции).
 * @param {React.RefObject<HTMLDivElement>} scrollContentRef - ссылка на элемент контейнера, который нужно скроллить.
 * @param {ScrollType} scrollType - Тип скролла (вертикальный или горизонтальный).
 * @param {() => void} [onReachedBottom] - Колбэк, который вызывается при достижении нижней границы контейнера.
 *
 * @returns {Object} Объект, содержащий:
 * - `startDragging`: Функция для начала перетаскивания. Принимает событие `React.MouseEvent`.
 * - `isDragging`: Состояние, указывающее, происходит ли перетаскивание в данный момент.
 *
 * @example
 * const { startDragging, isDragging } = useDragScroll(
 *   scrollProperties,
 *   scrollContentRef,
 *   ScrollType.vertical,
 *   () => console.log('Reached bottom!')
 * );
 *
 * <div
 *   ref={scrollContentRef}
 *   onMouseDown={startDragging}
 *   style={{ overflow: 'auto', height: '300px' }}
 * >
 *   {/* Контент для скролла * /}
 * </div>
 */

const minScrollPosition = 0;

export function useDragScroll(
	scrollProperties: ScrollProperties,
	scrollContentRef: HTMLDivElement,
	scrollType: ScrollType,
	onReachedBottom?: () => void
) {
	const [isDragging, setIsDragging] = useState(false);
	const offsetRef = useRef(0);

	const startDragging = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			event.preventDefault();
			setIsDragging(true);

			// Запоминаем смещение точки захвата внутри скролл-трека
			offsetRef.current =
				scrollType === ScrollType.Vertical ? event.clientY - scrollProperties.position : event.clientX - scrollProperties.position;
		},
		[scrollProperties, scrollType]
	);

	const onReachedBottomRef = useRef(onReachedBottom);
	onReachedBottomRef.current = onReachedBottom;

	/**@description предотвращает частый вызов метода достижения конца прокрутки */
	const debouncedOnReachedBottom = useMemo(
		() =>
			debounce(() => {
				onReachedBottomRef.current?.();
			}, 250),
		[]
	);

	useEffect(() => () => debouncedOnReachedBottom.cancel(), [debouncedOnReachedBottom]);

	/**
	 * Обработчик движения мыши. Выполняет перемещение контента при перетаскивании скроллбара.
	 * @param event - Событие движения мыши.
	 */
	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!isDragging || !scrollContentRef) return;

			const content = scrollContentRef;
			const contentSize = scrollType === ScrollType.Vertical ? content.clientHeight : content.clientWidth;
			const scrollSize = scrollType === ScrollType.Vertical ? content.scrollHeight : content.scrollWidth;
			const maxScrollPosition = contentSize - scrollProperties.size;

			// Новая позиция скролл-трека
			let newScrollPosition =
				scrollType === ScrollType.Vertical ? event.clientY - offsetRef.current : event.clientX - offsetRef.current;

			newScrollPosition = Math.min(maxScrollPosition, Math.max(minScrollPosition, newScrollPosition));
			scrollProperties.setPosition(newScrollPosition);

			// Вычисляем новую позицию контента
			const scrollRatio = newScrollPosition / maxScrollPosition;
			const offset = scrollRatio * (scrollSize - contentSize);

			if (scrollType === ScrollType.Vertical) {
				content.scrollTop = offset;
				if (offset + contentSize >= scrollSize) {
					debouncedOnReachedBottom();
				}
			} else {
				content.scrollLeft = offset;
			}
		},
		[isDragging, scrollContentRef, scrollType, scrollProperties, debouncedOnReachedBottom]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		} else {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		}
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	return { startDragging, isDragging };
}
