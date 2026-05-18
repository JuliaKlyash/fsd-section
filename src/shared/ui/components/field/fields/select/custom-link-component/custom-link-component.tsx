import React from "react";
import classNames from "classnames";


import styles from "./custom-link-component.module.scss";

interface LinkProps {
	inputLink?: string;
	linkTarget?: string;
	isDisabled?: boolean;
	size: "small" | "medium" | "large";
	value: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const CustomLinkComponent = (props: LinkProps) => {
	const { inputLink, linkTarget, value, onClick } = props;

	if (!inputLink) return null;

	const inputLinkClassname = classNames(styles.inputLink, styles[`${props.size}Input`], {
		[`${styles.disabledLink}`]: props.isDisabled
	});

	return (
		<a href={inputLink} target={linkTarget} className={inputLinkClassname} onClick={onClick}>
			{value}
		</a>
	);
};
