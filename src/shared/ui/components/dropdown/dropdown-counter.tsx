import classNames from "classnames";

import { HorizontalDivider } from "../divider";


import styles from "./dropdown.module.scss";

export interface CounterProps {
	size: "small" | "medium" | "large";
	count: number;
}

export const DropdownCounter = (props: CounterProps) => {
	const counterTextClasses = classNames(styles[`${props.size}CounterText`]);

	return (
		<>
			<HorizontalDivider />
			<div className={styles.resultCounter}>
				<span className={counterTextClasses}>Найдено: {props.count}</span>
			</div>
		</>
	);
};
