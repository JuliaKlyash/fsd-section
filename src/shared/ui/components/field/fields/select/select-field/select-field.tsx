import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Dropdown } from "../../../../dropdown/dropdown";
import { Hint } from "../../../../hint/hint";
import type { BaseSelectProps } from "../../fields";
import { CustomLinkComponent } from "../custom-link-component";

import { ChevronCompactDown } from "@/shared/ui/icons/chevron-compact-down";
import { ClearSolid } from "@/shared/ui/icons/clear-solid";
import { Locker } from "@/shared/ui/icons/locker";

import { isUndefined } from "@/shared/lib";

import styles from "../../../fields.module.scss";

export function SelectField(props: BaseSelectProps) {
	const [openedDropdown, setOpenedDropdown] = useState<boolean>(false);
	const [quantity, setQuantity] = useState<number>(0);
	const selectRef = useRef<HTMLDivElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);

	const selectClasses = classNames(styles.fieldWrap, styles.selectFieldWrap, styles[`${props.size}Field`], {
		[styles.placeholderFocus]: props.value.length === 0,
		[styles.disabledField]: props.isDisabled,
		[styles.fieldFocused]: openedDropdown,
		[styles.errorField]: props.isError
	});

	const clearClasses = classNames(styles.defaultButtonContainer, styles.clearButton, {
		[`${styles.visible}`]: props.value.length > 0
	});

	const valueClasses = classNames(
		styles.selectValue,
		styles[`${props.size}SelectValue`],
		styles[`${props.size}Input`],
		styles.selectText,
		{
			[styles.input]: props.value.length > 0,
			[styles.defaultPlaceholder]: props.value.length === 0
		}
	);

	const iconsBlockClasses = classNames(styles.selectIconsBlock, {
		[styles.rightPadding]: !props.isClearing || props.value.length <= 0
	});

	const lockerClasses = classNames(styles.selectIconsBlock, styles.lockerButton);

	useEffect(() => {
		function wheel(e: WheelEvent) {
			if (openedDropdown) e.preventDefault();
		}
		if (openedDropdown) {
			document.addEventListener("mousedown", handleClick);
		} else {
			document.removeEventListener("mousedown", handleClick);
		}

		window.addEventListener("wheel", wheel, { passive: false });
		return () => {
			document.removeEventListener("mousedown", handleClick);
			window.removeEventListener("wheel", wheel);
		};
	}, [openedDropdown]);

	useEffect(() => {
		let counter = props.quantity ?? 0;
		if (!props.quantity) {
			props.items?.forEach((group) => (counter += group.items.length));
		}
		setQuantity(counter);
	}, [props.items]);

	const value = useMemo(() => (props.value.length > 0 ? props.value : props.placeholder), [props.value, props.placeholder]);

	const selectedValue = useMemo(() => {
		if (props.inputLink && props.value.length > 0) {
			return (
				<CustomLinkComponent
					inputLink={props.inputLink}
					linkTarget={props.linkTarget ?? "_blank"}
					value={props.value}
					size={props.size}
					isDisabled={props.isDisabled}
					onClick={(event) => event.stopPropagation()}
				/>
			);
		}

		if (props.value.length > 0 && props.selectedValue) {
			return <span className={styles.selectValueContent}>{props.selectedValue}</span>;
		}

		return <span className={valueClasses}>{value}</span>;
	}, [
		props.inputLink,
		props.value,
		props.selectedValue,
		props.linkTarget,
		props.size,
		props.isDisabled,
		value,
		valueClasses
	]);

	const handleClear = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
			props.onChange("");
		},
		[props.onChange]
	);

	const handleClick = useCallback(
		(event: any) => {
			if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
				setOpenedDropdown(false);
				props.onChangeSearchValue?.("");
			}
		},
		[wrapRef.current, props.onChangeSearchValue]
	);

	const handleVisibleDropdown = useCallback(() => {
		if (props.isDisabled) return;
		if (openedDropdown) props.onChangeSearchValue?.("");
		setOpenedDropdown(!openedDropdown);
	}, [openedDropdown, props.isDisabled]);

	const handleWrapBlur = useCallback(() => {
		if (!openedDropdown) {
			props.onBlur?.();
		}
	}, [openedDropdown, props.onBlur]);

	const handleSelectBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement, Element>) => {
			if (openedDropdown) {
				event.preventDefault();
			}
		},
		[openedDropdown]
	);
	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault();
	}, []);

	const rightBlockSelect = useMemo(
		() =>
			!props.isDisabled ? (
				<>
					<div className={iconsBlockClasses}>
						{props.value.length > 0 && props.isClearing && (
							<Hint hintBody="Очистить" startPosition="left" >
								<div className={clearClasses} onClick={handleClear} onMouseDown={handleMouseDown}>
									<ClearSolid size='16' className={styles.clearButton} />
								</div>
							</Hint>
						)}
						<div className={styles.defaultButtonContainer} onClick={handleVisibleDropdown}>
							<ChevronCompactDown size='16' className={styles.dropdownButton} />
						</div>
					</div>
				</>
			) : (
				<Locker size='16' className={lockerClasses} />
			),
		[props, clearClasses, props.value.length]
	);

	const hasSearch = useMemo(() => {
		if (!isUndefined(props.searchValue)) {
			if (props.searchValue.length > 0) return true;
			else return quantity > 10;
		} else return false;
	}, [props.searchValue, quantity]);

	const handleReachedBottom = useCallback(() => {
		props.onReachedBottom?.();
	}, [props.onReachedBottom]);

	return (
		<div id={`select-${props.id}`} key={props.id} ref={wrapRef} className={styles.selectorWrapper} onBlur={handleWrapBlur}>
			<div ref={selectRef} onClick={handleVisibleDropdown}>
				<div className={selectClasses} onBlur={handleSelectBlur} style={props.width ? { width: props.width } : undefined}>
					{selectedValue}
					{rightBlockSelect}
				</div>
			</div>
			{openedDropdown && (
				<Dropdown
					size="small"
					variant="select"
					items={props.items}
					parentRef={selectRef.current!}
					quantity={quantity}
					hasSearch={hasSearch}
					onClose={() => setOpenedDropdown(false)}
					searchValue={props.searchValue}
					onChangeSearchValue={props.onChangeSearchValue}
					onReachedBottom={handleReachedBottom}
				/>
			)}
		</div>
	);
}
