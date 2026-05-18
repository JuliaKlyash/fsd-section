import React, {
	type CSSProperties,
	type DetailedHTMLProps,
	forwardRef,
	type HTMLAttributes,
	type JSX,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import { debounce, isUndefined } from "@/shared/lib";
import classNames from "classnames";

import { HorizontalScrollTrack, VerticalScrollTrack } from "./scroll-tracks";

import { ScrollContainerType } from "./model/types";

import styles from "./scroll-container.module.scss";

export const MIN_SCROLL_SIZE = 20;
export const SCROLL_SIZE_HIDDEN = -1;

/**
 * Компонент контейнера с поддержкой вертикального и горизонтального скролла.
 * @param {ScrollContainerType} type - Тип контейнера для скролла :auto (добавит оба вида скролла, если потребуется), vertical (добавит только вертикальный), horizontal (добавит только горизонтальный).
 * @param {JSX.Element | JSX.Element[]} children - Тело компонента, которое необходимо скроллить.
 * @param {() => void} [onReachedBottom] - Необязательный параметр - коллбэк, вызываемый при достижении нижней границы контейнера.
 * @param {boolean} [withMouseDrag] - Необязательный параметр, который отвечает за то, можно ли прокручивать контент зажатием мыши. (реализовано для горизонтальной прокрутки)
 * @param {boolean} [isInnerContainer] - Параметр, отвечающий за то, находится ли данный скролл-контейнер внутри другого
 *  * @example
 * // Пример использования компонента с вертикальным скроллом
 * const setItems = useCallback(() => {
		const items = [];
		for (let i = 0; i < 101; i++) {
			items.push(<div style={{ border: "1px solid red", width: "100px", height: "20px" }}>{i}</div>);
		}
		return items;
	}, []);
 * <ScrollContainer type={ScrollContainerType.Vertical} onReachedBottom={() => console.log('Reached bottom!')}>
 *    {setItems()}
 * </ScrollContainer>
 *
 * @example
 * // Пример использования компонента с автоматическим скроллом
 * <ScrollContainer type={ScrollContainerType.Auto}>
		{setItems()}
	</ScrollContainer>
 */

export type ScrollContainerProps = {
	type: ScrollContainerType;
	children: JSX.Element | JSX.Element[];
	onReachedBottom?: () => void;
	withMouseDrag?: boolean;
	isInnerContainer?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
	(
		{ isInnerContainer, type, children, withMouseDrag, onReachedBottom, onMouseEnter, onMouseLeave, className, ...restProps },
		forwardedRef
	) => {
		const scrollContentRef = useRef<HTMLDivElement>(null);
		const [verticalScrollPosition, setVerticalScrollPosition] = useState<number>(0);
		const [horizontalScrollPosition, setHorizontalScrollPosition] = useState<number>(0);
		const [contentIsHovering, setContentIsHovering] = useState(false);

		// Длины скроллов
		const verticalScrollSize = useRef<number>(0);
		const horizontalScrollSize = useRef<number>(0);

		// Для прокрутки контента мышью при withMouseDrag=true
		const [isDragging, setIsDragging] = useState(false);
		const initialMouseX = useRef<number>(0);
		const initialScrollLeft = useRef<number>(0);

		const isVerticalVisible = useMemo(() => type !== ScrollContainerType.Horizontal, [type]);
		const isHorizontalVisible = useMemo(() => type !== ScrollContainerType.Vertical, [type]);

		// Объединяем внутренний ref с переданным forwardedRef
		useEffect(() => {
			if (typeof forwardedRef === "function") {
				forwardedRef(scrollContentRef.current);
			} else if (forwardedRef) {
				forwardedRef.current = scrollContentRef.current;
			}
		}, [forwardedRef]);

		const contentStyle = useMemo((): CSSProperties => {
			if (type === ScrollContainerType.Auto) {
				return { overflow: "auto" };
			} else if (type === ScrollContainerType.Horizontal) {
				return { overflowX: "auto", overflowY: "hidden" };
			} else {
				return { overflowX: "hidden", overflowY: "auto" };
			}
		}, [type]);

		const handleReachedBottom = useCallback(() => {
			onReachedBottom?.();
		}, [onReachedBottom]);

		/**@description Высчитывает размеры скролла относительно контейнера */
		const getScrollSize = useCallback(
			(visibleSize: number, contentSize: number) => {
				if (contentSize <= visibleSize) {
					return SCROLL_SIZE_HIDDEN; // Скроллбар не нужен
				}
				const scrollbarSize = (visibleSize / contentSize) * visibleSize;
				const maxSize = Math.max(scrollbarSize, MIN_SCROLL_SIZE);
				const ceilSize = Math.ceil(maxSize); // Округляем до целого
				if (ceilSize < visibleSize) {
					return ceilSize;
				} else {
					return SCROLL_SIZE_HIDDEN; // Скроллбар не нужен
				}
			},
			[children]
		);

		/**@description предотвращает частый вызов метода достижения конца прокрутки */
		const debouncedOnReachedBottom = useCallback(debounce(handleReachedBottom, 250), [handleReachedBottom]);

		/**@description Вычисляет новое положение скроллбара.*/
		const getNewScrollPosition = useCallback((contentSize: number, clientSize: number, scrollPosition: number, scrollSize: number) => {
			// Вычисляем новое положение скролла
			const scrollRatio = scrollPosition / (contentSize - clientSize);
			const newScrollPosition = scrollRatio * (clientSize - scrollSize);

			// Ограничиваем новое положение скролла
			const maxScrollPosition = clientSize - scrollSize;
			const minScrollPosition = 0;

			return Math.min(maxScrollPosition, Math.max(minScrollPosition, newScrollPosition));
		}, []);

		const handleWheel = useCallback(
			(event: WheelEvent) => {
				// Останавливаем всплытие событий скролла во внутреннем ScrollContainer
				if (isInnerContainer) {
					event.stopPropagation();
					return;
				}
				const content = scrollContentRef.current;
				if (content) {
					// Если зажат Shift, прокручиваем горизонтально
					if (event.shiftKey && isHorizontalVisible) {
						content.scrollLeft += event.deltaY;
					} else {
						// Если вертикальная прокрутка отключена, прокручиваем горизонтально
						if (type === ScrollContainerType.Horizontal) {
							content.scrollLeft += event.deltaY;
						} else {
							// Прокрутка вертикально
							if (isVerticalVisible) {
								if (verticalScrollSize.current !== SCROLL_SIZE_HIDDEN) {
									content.scrollTop += event.deltaY;
								}
							}
							// Прокрутка горизонтально (без Shift)
							if (isHorizontalVisible) {
								if (horizontalScrollSize.current !== SCROLL_SIZE_HIDDEN) {
									content.scrollLeft += event.deltaX;
								}
							}
						}
					}
				}
			},
			[isVerticalVisible, isHorizontalVisible, scrollContentRef, isInnerContainer]
		);

		/**
		 * Вычисляет новое положение скроллбара на основе текущего положения контента и ограничивает его в пределах допустимых значений.
		 * @param {HTMLDivElement} content - Элемент контента, который скроллится.
		 * @param {number} scrollSize - Размер скроллбара (высота или ширина).
		 * @param {(position: number) => void} setScrollPosition - Функция для обновления положения скроллбара.
		 * @param {'scrollHeight' | 'scrollWidth'} scrollDimension - Свойство элемента, определяющее полный размер контента (высота или ширина).
		 * @param {'clientHeight' | 'clientWidth'} clientDimension - Свойство элемента, определяющее видимый размер контента (высота или ширина).
		 * @param {'scrollTop' | 'scrollLeft'} scrollPosition - Свойство элемента, определяющее текущее положение скролла (вертикальное или горизонтальное).
		 * @param {() => void} [onReachedBottom] - Необязательный коллбэк, который вызывается при достижении нижней границы контейнера (только для вертикального скролла).
		 */
		const handleScroll = useCallback(
			(
				content: HTMLDivElement,
				scrollSize: number,
				setScrollPosition: (position: number) => void,
				scrollDimension: "scrollHeight" | "scrollWidth",
				clientDimension: "clientHeight" | "clientWidth",
				scrollPosition: "scrollTop" | "scrollLeft",
				onReachedBottom?: () => void
			) => {
				const contentSize = content[scrollDimension]; // Полная высота или ширина контента
				const clientSize = content[clientDimension]; // Высота или ширина видимой области

				if (clientSize > 0 && contentSize > clientSize) {
					const newScrollPosition = getNewScrollPosition(contentSize, clientSize, content[scrollPosition], scrollSize);
					setScrollPosition(newScrollPosition);

					// Проверяем, достигнут ли конец контейнера (только для вертикального скролла)
					if (scrollDimension === "scrollHeight" && !isUndefined(onReachedBottom)) {
						const isReachedBottom = content.scrollTop + clientSize >= contentSize - 1; // Добавляем погрешность
						if (isReachedBottom) {
							debouncedOnReachedBottom();
						}
					}
				} else {
					setScrollPosition(0);
				}
			},
			[debouncedOnReachedBottom, getNewScrollPosition]
		);

		/** @description Обработка вертикального скролла */
		const handleVerticalScroll = useCallback(
			(content: HTMLDivElement) => {
				handleScroll(
					content,
					verticalScrollSize.current,
					setVerticalScrollPosition,
					"scrollHeight",
					"clientHeight",
					"scrollTop",
					handleReachedBottom
				);
			},
			[verticalScrollSize.current, handleReachedBottom, handleScroll]
		);

		/** @description Обработка горизонтального скролла */
		const handleHorizontalScroll = useCallback(
			(content: HTMLDivElement) => {
				handleScroll(
					content,
					horizontalScrollSize.current,
					setHorizontalScrollPosition,
					"scrollWidth",
					"clientWidth",
					"scrollLeft"
				);
			},
			[horizontalScrollSize.current, handleScroll]
		);

		/**@description Обработка события скроллинга контента */
		const handleEventScroll = useCallback(() => {
			if (contentIsHovering) {
				const content = scrollContentRef.current;
				if (content) {
					if (isVerticalVisible) {
						handleVerticalScroll(content);
					}
					if (isHorizontalVisible) {
						handleHorizontalScroll(content);
					}
				}
			}
		}, [scrollContentRef, contentIsHovering, isVerticalVisible, isHorizontalVisible, handleVerticalScroll, handleHorizontalScroll]);

		/**@description Высчитывает размеры скролла относительно контейнера */
		const calculateScrollSizes = useCallback(() => {
			const content = scrollContentRef.current;
			if (content) {
				const clientHeight = content.clientHeight; // Высота видимой области
				const clientWidth = content.clientWidth; // Ширина видимой области

				const actualContentHeight = content.scrollHeight;
				const actualContentWidth = content.scrollWidth;

				verticalScrollSize.current = getScrollSize(clientHeight, actualContentHeight);
				horizontalScrollSize.current = getScrollSize(clientWidth, actualContentWidth);
			}
		}, [scrollContentRef, getScrollSize]);

		const handleMouseWrapEnter = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			setContentIsHovering(true);
			calculateScrollSizes();

			onMouseEnter?.(event);
		}, []);

		const handleMouseWrapLeave = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			setContentIsHovering(false);

			onMouseLeave?.(event);
		}, []);

		/**@description Обработчик начала прокручивании контента зажатием мыши при withMouseDrag=true */
		const handleContentMouseDown = useCallback(
			(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
				if (withMouseDrag) {
					event.stopPropagation();
					event.preventDefault();
					document.body.style.cursor = "grabbing";
					setIsDragging(true);

					initialMouseX.current = event.clientX;
					initialScrollLeft.current = scrollContentRef.current?.scrollLeft || 0;
				}
			},
			[withMouseDrag]
		);

		/**@description Обработчик движения мыши при прокручивании контента зажатием мыши при withMouseDrag=true */
		const handleContentMouseMove = useCallback(
			(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
				if (withMouseDrag && isDragging) {
					event.stopPropagation();
					const content = scrollContentRef.current;
					if (content) {
						const deltaX = event.clientX - initialMouseX.current;
						const newScrollLeft = initialScrollLeft.current - deltaX;
						content.scrollLeft = newScrollLeft;
					}
				}
			},
			[withMouseDrag, isDragging]
		);

		/**@description Обработчик окончания прокручивании контента зажатием мыши при withMouseDrag=true */
		const handleContentMouseUp = useCallback(() => {
			if (withMouseDrag) {
				setIsDragging(false);
				document.body.style.cursor = "default";
			}
		}, [withMouseDrag]);

		/**@description Обработчик выхода мыши за пределы контейнера при прокручивании контента зажатием мыши при withMouseDrag=true */
		const handleContentMouseLeave = useCallback(() => {
			if (withMouseDrag) {
				setIsDragging(false);
				document.body.style.cursor = "default";
			}
		}, [withMouseDrag]);

		useEffect(() => {
			const content = scrollContentRef.current;
			if (!content) return;

			if (contentIsHovering) {
				content.addEventListener("scroll", handleEventScroll);
				content.addEventListener("wheel", handleWheel, { passive: false });
			} else {
				content.removeEventListener("wheel", handleWheel);
				content.removeEventListener("scroll", handleEventScroll);
			}

			return () => {
				content.removeEventListener("wheel", handleWheel);
				content.removeEventListener("scroll", handleEventScroll);
			};
		}, [scrollContentRef, contentIsHovering, handleEventScroll, handleWheel]);

		/**@description Обновление размеров при изменении контента */
		useEffect(() => {
			calculateScrollSizes();
		}, [children, calculateScrollSizes]);

		/**@description Используем ResizeObserver для отслеживания изменений размеров контейнера*/
		useEffect(() => {
			const container = scrollContentRef.current;
			if (!container) {
				return;
			}

			const resizeObserver = new ResizeObserver(calculateScrollSizes);
			resizeObserver.observe(container); // Начинаем наблюдение

			return () => {
				resizeObserver.unobserve(container); // Останавливаем наблюдение при размонтировании
			};
		}, [calculateScrollSizes]);

		return (
			<div
				{...restProps}
				className={classNames(styles.scrollContainer, className)}
				onMouseOver={handleMouseWrapEnter}
				onMouseOut={handleMouseWrapLeave}
			>
				<div
					ref={scrollContentRef}
					className={styles.scrollContent}
					style={contentStyle}
					onMouseDown={handleContentMouseDown}
					onMouseUp={handleContentMouseUp}
					onMouseLeave={handleContentMouseLeave}
					onMouseMove={handleContentMouseMove}
				>
					{children}
				</div>
				{Boolean(type === ScrollContainerType.Auto || type === ScrollContainerType.Vertical) && (
					<VerticalScrollTrack
						scrollContentRef={scrollContentRef.current!}
						contentIsHovering={contentIsHovering}
						scrollProperties={{
							size: verticalScrollSize.current,
							position: verticalScrollPosition,
							setPosition: setVerticalScrollPosition
						}}
						handleScroll={handleEventScroll}
						onReachedBottom={handleReachedBottom}
					/>
				)}
				{Boolean(type === ScrollContainerType.Auto || type === ScrollContainerType.Horizontal) && (
					<HorizontalScrollTrack
						scrollContentRef={scrollContentRef.current!}
						contentIsHovering={contentIsHovering}
						scrollProperties={{
							size: horizontalScrollSize.current,
							position: horizontalScrollPosition,
							setPosition: setHorizontalScrollPosition
						}}
						handleScroll={handleEventScroll}
					/>
				)}
			</div>
		);
	}
);
