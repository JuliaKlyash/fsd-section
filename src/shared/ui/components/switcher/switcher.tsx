import { type JSX } from "react";
import classNames from "classnames";
import { v4 } from "uuid";

import { Lock } from "../../icons/lock";

import styles from "./switcher.module.scss";

export type Size = "small" | "medium" | "large";
export type Alert = "default" | "error";

export type SwitchElement = {
	id: string;
	text: string;
	icon?: JSX.Element;
	disabled?: boolean;
};

export type SwitchElementProps = {
	element: SwitchElement;
	size: Size;
	value: string;
	onSwitch: (value: string) => void;
	disabledAllElements?: boolean;
};

export type SwitcherProps = {
	size: Size;
	elements: Array<SwitchElement>;
	value: string;
	onSwitch: (value: string) => void;
	disabled?: boolean;
	alert?: Alert;
};

/**@description Элемент переключателя */
export function SwitchElement(props: SwitchElementProps) {
	const upperFirstText = props.element.text ? props.element.text[0]?.toUpperCase() + props.element.text?.slice(1) : "";

	const elementClasses = classNames(styles.wrapElement, styles[`${props.size}Element`], {
		[`${styles.selectedElement}`]: props.value === props.element.id
	});

	function handleChange() {
		if (props.disabledAllElements || props.element.disabled) return;
		props.onSwitch(props.element.id);
	}

	const leftIcon = props.disabledAllElements || props.element.disabled ? <Lock size="16" /> : props.element.icon ?? null;

	return (
		<div className={elementClasses} onClick={handleChange}>
			{leftIcon}
			{props.element.text && <span className={styles.textContainer}>{upperFirstText}</span>}
		</div>
	);
}

/**@description Переключатель */
export function Switcher(props: SwitcherProps) {
	const wrapClasses = classNames(styles.wrapper, styles[`${props.alert ?? "default"}Wrapper`]);

	const key = v4();
	return (
		<div className={wrapClasses}>
			{props.elements.map((element) => (
				<SwitchElement
					key={`${element.id}-${key}`}
					element={element}
					size={props.size}
					value={props.value}
					onSwitch={props.onSwitch}
					disabledAllElements={props.disabled}
				/>
			))}
		</div>
	);
}
