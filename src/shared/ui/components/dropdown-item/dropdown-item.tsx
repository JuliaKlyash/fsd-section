import type { JSX } from "react";
import classNames from "classnames";

import styles from "./dropdown-item.module.scss";

interface DropdownItemProps {
	id: string;
	title: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	icon?: JSX.Element;
	onMouseEnter?: () => void;
	onMouseDown?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	isDisabled?: boolean;
}

/**@description Компонент для отображения элемента в выпадающем списке */
export const DropdownItem = (props: DropdownItemProps) => {
	const { id, title, onClick, onMouseEnter, onMouseDown, icon, isDisabled } = props;

	const itemClasses = classNames(styles.dropdownItem, {
		[styles.disabled]: isDisabled
	});

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isDisabled) return;
		onClick?.(event);
	};

	return (
		<button
			key={`dropdown-item-${id}`}
			className={itemClasses}
			onClick={handleClick}
			onMouseEnter={onMouseEnter}
			onMouseDown={onMouseDown}
		>
			{icon && <div className={styles.icon}>{icon}</div>}
			<span className={styles.title}>{title}</span>
		</button>
	);
};
