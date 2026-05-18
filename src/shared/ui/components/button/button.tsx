import classNames from "classnames";
import React, { forwardRef, useCallback, type DetailedHTMLProps, type HTMLAttributes, type JSX, type MouseEventHandler } from "react";

import { Loading } from "../../icons/loading";

import style from "./button.module.scss";

export type ButtonProps = {
	text?: string;
	size: "small" | "medium" | "large";
	variant:
	| "default"
	| "backless"
	| "primary"
	| "success"
	| "secondary"
	| "danger"
	| "disabled"
	| "caution";
	border?: boolean;
	loading?: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
	leftIcon?: JSX.Element;
	rightIcon?: JSX.Element;
} & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const cx = classNames.bind(style);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, forwardedRef) => {
	const { text, size, variant, border, loading, onClick, leftIcon, rightIcon, ...restProps } = props;

	const wrapStyles = cx([style.button], [style[size]], [style[loading ? "loading" : variant]], {
		[style.disableBorder]: !border,
	});

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			if (variant !== "disabled") {
				onClick(event);
			}
		},
		[variant, onClick]
	);

	return (
		<button {...restProps} onClick={handleClick} className={wrapStyles} ref={forwardedRef}>
			{loading ? <Loading size="16" /> : ""}
			{!loading && leftIcon && leftIcon}
			{text && <span className={style.text}>{text}</span>}
			{(!loading && rightIcon) && rightIcon}
		</button>
	);
});