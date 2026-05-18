import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";


import type { BaseTextProps } from "../fields";

import { Search } from "@/shared/ui/icons/search";
import { ClearSolid } from "@/shared/ui/icons/clear-solid";
import { Locker } from "@/shared/ui/icons/locker";
import { Hint } from "../../../hint/hint";

import styles from "../../fields.module.scss";

export function TextField(props: BaseTextProps) {
	const [charactersRemainder, setCharactersRemainder] = useState(props.counter);
	const localRef = useRef<HTMLInputElement>(null);
	const ref = props.inputRef ?? localRef;

	const iconSize = '16'

	const fieldClasses = classNames(styles.fieldWrap, styles.defaultFieldWrap, styles[`${props.size}Field`], {
		[`${styles.placeholderFocus}`]: props.value.length === 0,
		[`${styles.disabledField}`]: props.isDisabled,
		[styles.errorField]: props.isError
	});

	const searchFieldClasses = classNames(styles.fieldWrap, styles.searchFieldWrap, styles[`${props.size}Field`], {
		[`${styles.placeholderFocus}`]: props.value.length === 0
	});

	const inputClasses = classNames(styles.input, styles[`${props.size}Input`]);

	const clearClasses = classNames(styles.defaultButtonContainer, styles.textClearButtonContainer, {
		[`${styles.visible}`]: props.value?.length > 0
	});

	const leftIcon = classNames({ [`${styles.leftIcon}`]: props.leftIcon || props.isSearch });

	const lockerClasses = classNames(styles.lockerButton);

	useEffect(() => {
		if (props.counter) {
			const charactersRemainder = props.counter - props.value?.length;
			setCharactersRemainder(charactersRemainder);
		}
	}, [props.value, props.counter, props.onError, setCharactersRemainder]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!props.isDisabled) {
				props.onChange(event.target.value);
			}
		},
		[props.onChange, props.isDisabled]
	);

	/**
	 * @description функция, определяющая положение курсора
	 */
	const getCursorPosition = useCallback(() => {
		const inputElement = ref as React.RefObject<HTMLInputElement>;
		if (inputElement.current) {
			return inputElement.current.selectionStart;
		} else {
			return 0;
		}
	}, [ref]);

	/**
	 * @description хэндлер, вызывающий вспыхивание при нажатии определенных клавиш
	 */
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			const cursorPosition = getCursorPosition();

			if (props.counter) {
				if (
					(event.code === "Delete" || event.code === "ArrowRight" || event.code === "ArrowDown") &&
					cursorPosition === props.value?.length
				) {
					props.onError?.current();
				}
				if ((event.code === "ArrowLeft" || event.code === "Backspace" || event.code === "ArrowUp") && cursorPosition === 0) {
					props.onError?.current();
				}

				if (props.counter - props.value?.length <= 0) {
					if ((event.code === "Delete" || event.code === "ArrowRight") && cursorPosition === props.counter) {
						props.onError?.current();
					}
					if (event.code !== "ArrowLeft" && event.code !== "Backspace") {
						props.onError?.current();
					}
				}

				if (props.value?.length === 0) {
					if (
						event.code === "Delete" ||
						event.code === "ArrowRight" ||
						event.code === "ArrowLeft" ||
						event.code === "Backspace" ||
						event.code === "Enter"
					) {
						props.onError?.current();
					}
				}
			}
			props.onKeyDown?.(event);
		},
		[props.counter, props.value, getCursorPosition, props.onKeyDown]
	);

	const handleFocus = useCallback(() => {
		props.onFocus?.();
	}, [props.onFocus]);

	const handleOnBlur = useCallback(() => {
		props.onBlur?.();
	}, [props.onBlur]);

	const handleClear = useCallback(() => {
		props.onChange("");
	}, [props.onChange]);

	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault();
	}, []);

	// Обработчик клика по иконке поиска
	const handleSearchIconClick = useCallback(() => {
		if (typeof ref === "function") {
			return;
		}
		if (ref.current) {
			ref.current.focus();
		}
	}, [ref]);

	const rightBlockInput = useMemo(
		() =>
			!props.isDisabled ? (
				<>
					{props.isClearing && (
						<Hint hintBody="Очистить" startPosition="left" >
							<div className={clearClasses} onClick={handleClear} onMouseDown={handleMouseDown}>
								<ClearSolid size={iconSize} className={styles.clearButton} />
							</div>
						</Hint>
					)}
				</>
			) : (
				<Locker size={iconSize} className={lockerClasses} />
			),
		[props, charactersRemainder, props.value, clearClasses, lockerClasses]
	);

	const leftBlockInput = useMemo(() => {
		if (props.leftIcon) {
			return <div className={leftIcon}>{props.leftIcon}</div>;
		}
		if (props.isSearch) {
			return (
				<div className={leftIcon} onClick={handleSearchIconClick}>
					<Search size={iconSize} />
				</div>
			);
		}

		return null;
	}, [props.leftIcon, props.isSearch, leftIcon, iconSize, handleSearchIconClick]);

	return (
		<div key={props.id} className={props.isSearch ? searchFieldClasses : fieldClasses}>
			{leftBlockInput}
			<input
				id={props.id}
				data-testid={props.dataTestId}
				value={props.value}
				onChange={handleChange}
				placeholder={props.placeholder}
				className={inputClasses}
				onBlur={handleOnBlur}
				disabled={props.isDisabled}
				maxLength={props.counter}
				size={props.counter}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				ref={ref}
			/>
			{rightBlockInput}
		</div>
	);
}
