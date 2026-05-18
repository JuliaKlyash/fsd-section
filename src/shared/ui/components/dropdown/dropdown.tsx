import React, { useState, useCallback, useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, forwardRef, type JSX } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { DropdownContent } from "./dropdown-content";

import styles from "./dropdown.module.scss";

export interface ItemGroup {
	items: Array<JSX.Element>;
	layout: JSX.Element;
}

export interface DropdownProps {
	size: 'small' | 'medium' | 'large';
	variant: "button" | "select";
	items: Array<ItemGroup>;
	quantity: number;
	hasSearch: boolean;
	parentRef?: HTMLDivElement;
	onClose?: () => void;
	searchValue?: string;
	onChangeSearchValue?: (searchValue: string) => void;
	onReachedBottom?: () => void;
	/** Рендерить dropdown через портал */
	usePortal?: boolean;
	/** HTML атрибуты для портального контейнера */
	portalProps?: HTMLAttributes<HTMLDivElement>;
}

const MARGIN = 4;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>((props, forwardedRef) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	const setRefs = (node: HTMLDivElement | null) => {
		(dropdownRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
		if (typeof forwardedRef === "function") forwardedRef(node);
		else if (forwardedRef) forwardedRef.current = node;
	};
	const [positionStyle, setPositionStyle] = useState<CSSProperties>({});
	const wrapClasses = classNames(styles.wrapper, styles[`${props.variant}List`]);

	/**@description метод обновляет позиционирование дропдауна относительно экрана, родительского компонента и скролла */
	const updatePosition = useCallback(() => {
		if (!props.parentRef || !dropdownRef.current) return;

		const parentRect = props.parentRef.getBoundingClientRect();
		const dropdown = dropdownRef.current;
		const dropdownHeight = dropdown.offsetHeight;
		const dropdownWidth = dropdown.offsetWidth;

		let top = parentRect.bottom + MARGIN;
		let left = parentRect.left;

		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;

		// Проверяем, выходит ли дропдаун за границы экрана
		const overflowsBottom = top + dropdownHeight > viewportHeight;
		const overflowsRight = left + dropdownWidth > viewportWidth;
		const overflowsLeft = left < MARGIN;

		if (overflowsBottom) {
			top = parentRect.top - dropdownHeight - MARGIN;
		}

		if (overflowsRight) {
			left = parentRect.right - dropdownWidth; // Используем правый край родителя
		} else if (overflowsLeft) {
			left = MARGIN;
		}

		// Обрабатываем "right-down"
		if (!overflowsBottom && overflowsRight) {
			left = parentRect.right - dropdownWidth; // Отталкиваемся от правого края родителя
			top = parentRect.bottom + MARGIN; // Оставляем стандартное положение вниз
		}

		setPositionStyle({
			top: `${top}px`,
			left: `${left}px`,
			width: props.variant === "select" ? `${parentRect.width}px` : "auto"
		});
	}, [props.parentRef, props.variant]);

	useLayoutEffect(() => {
		updatePosition();

		const observer = new MutationObserver(() => {
			updatePosition();
		});

		if (dropdownRef.current) {
			observer.observe(dropdownRef.current, { childList: true, subtree: true, attributes: true });
		}

		// Обрабатываем вертикальную и горизонтальную прокрутку
		const handleScroll = () => updatePosition();

		// Слушаем события прокрутки для родителя
		if (props.parentRef) {
			props.parentRef.addEventListener("scroll", handleScroll, true);
		}

		// Слушаем глобальную прокрутку окна
		window.addEventListener("scroll", handleScroll, true);
		window.addEventListener("resize", updatePosition);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll, true);
			window.removeEventListener("resize", updatePosition);

			if (props.parentRef) {
				props.parentRef.removeEventListener("scroll", handleScroll, true);
			}
		};
	}, [updatePosition, props.parentRef]);

	/**@description метод, вызываемый при достижении конца списка */
	const handleReachedBottom = useCallback(() => {
		props.onReachedBottom?.();
	}, [props.onReachedBottom]);

	const dropdownContent = (
		<div ref={setRefs} className={wrapClasses} style={positionStyle} onClick={(e) => e.stopPropagation()} {...props.portalProps}>
			<DropdownContent
				size={props.size}
				hasSearch={props.hasSearch}
				items={props.items}
				quantity={props.quantity}
				searchValue={props.searchValue}
				onChangeSearchValue={props.onChangeSearchValue}
				onReachedBottom={handleReachedBottom}
				onClose={props.onClose}
			/>
		</div>
	);

	// Если нужен портал - рендерим в document.body
	if (props.usePortal) {
		return ReactDOM.createPortal(dropdownContent, document.body);
	}

	// Иначе - обычный рендер
	return dropdownContent;
});
