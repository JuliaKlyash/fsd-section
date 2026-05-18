import React from "react";
import { useEffect, useState } from "react";
import classNames from "classnames";

import type { BaseBooleanProps } from "../fields";

import { Check } from "@shared/ui/icons/check";

import fieldStyles from "../../fields.module.scss";
import styles from "../../../checkbox/checkbox.module.scss";

export function BooleanField(props: BaseBooleanProps) {
	const [checked, setChecked] = useState<boolean>(props.value);

	useEffect(() => {
		setChecked(props.value);
	}, [props.value]);

	function handleChange(e: React.MouseEvent<HTMLDivElement>) {
		if (props.isDisabled) return;
		e.stopPropagation();
		props.onChange(!checked);
	}

	const checkboxContainer = classNames(fieldStyles[`${props.size}Field`], styles.checkboxWrapper, styles.fieldOutlined, {
		[`${styles.checkboxContainerDisabled}`]: props.isDisabled
	});

	const checkboxClassName = classNames(styles.checkbox, {
		[`${styles.checkboxSmall}`]: props.size === "small",
		[`${styles.checkboxMedium}`]: props.size === "medium",
		[`${styles.checkboxLarge}`]: props.size === "large",
		[`${styles.checkboxDefault}`]: !props.isError,
		[`${styles.checkboxError}`]: props.isError,
		[`${styles.checkboxDisabled}`]: props.isDisabled,
		[`${styles.checked}`]: checked
	});

	return (
		<div className={checkboxContainer} onClick={handleChange}>
			<div className={checkboxClassName}>{checked && <Check size='16' className={styles.icon} />}</div>
		</div>
	);
}
