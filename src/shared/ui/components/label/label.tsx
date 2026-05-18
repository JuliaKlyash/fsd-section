import { type HTMLAttributes } from "react";
import classNames from "classnames";

import { Hint } from "../hint/hint";

import { InfoSolid } from "@/shared/ui/icons/info-solid";
import { RequiredStar } from "@/shared/ui/icons/required-star";

import styles from "./label.module.scss";

export type LabelPosition = "horizontal" | "vertical";
export interface LabelProps extends HTMLAttributes<HTMLElement> {
	isRequired: boolean;
	text: string;
	size: "small" | "medium" | "large";
	hint?: string;
	variant?: "black" | "gray";
	labelPosition?: LabelPosition;
}

export function Label(props: LabelProps) {
	const labelWrapperClassName = classNames(styles.labelWrapper, {
		[`${styles.labelWrapperRow}`]: props.labelPosition === "horizontal"
	});

	const labelClassName = classNames(styles.label, styles[`${props.size}Label`]);

	const textClassName = classNames(styles.labelTextWrap, styles[`${props.variant ?? "black"}Text`], styles[`${props.size}Text`]);

	return (
		<div className={labelWrapperClassName}>
			<div className={labelClassName}>
				<span className={textClassName}>{props.text}</span>
				{props.isRequired && (
					<RequiredStar
						size={props.size === "small" ? "12" : props.size === "medium" ? "16" : "20"}
						className={styles.requiredStar}
					/>
				)}
				{props.hint && (
					<Hint hintBody={props.hint} startPosition="top" className={styles.hint}>
						<InfoSolid size='16' className={styles.info} />
					</Hint>
				)}
			</div>
			{props.children}
		</div>
	);
}
