import type { ForwardedRef, JSX } from "react";
import React from "react";

import { TextField } from "./text";
import { NumberField } from "./number/number-field";
import { SelectField } from "./select";
import { BooleanField } from "./boolean";
import type { ItemGroup } from "@/shared/ui/components/dropdown/dropdown";
import type { LabelPosition } from "@/shared/ui/components/label/label";

export type BaseType = "text" | "number" | "select" | "boolean";

export type NumberSubType = "integer" | "decimal";

type BaseProps = {
	type: BaseType;
	dataTestId?: string; //для тестирования, добавляется в data-testid для элементов
	id?: string;
	onChange: (value: any) => void;
	size: "small" | "medium" | "large";
	isError?: boolean;
	onError?: React.MutableRefObject<() => void>;
	isRequired?: boolean;
	isDisabled?: boolean;
	onBlur?: () => void;
	onFocus?: () => void;
	onKeyDown?: (event?: React.KeyboardEvent<HTMLDivElement>) => void;
	/**
	 * Валидаторы значения.
	 * Возвращает `string` (сообщение) или `null/undefined`, если ошибок нет.
	 */
	validators?: Array<(value: any) => string | null | undefined>;
	/**
	 * Когда выполнять валидацию.
	 * - `change`: при каждом вызове `onChange` из UI (включая picker).
	 * - `blur`: при потере фокуса.
	 * - `submit`: при попытке "submit" (в UI-kit сейчас маппится на Enter).
	 */
	validateOn?: Array<"change" | "blur" | "submit">;
	/*Свойства для лейбла */
	label?: string;
	labelPosition?: LabelPosition;
	labelVariant?: "black" | "gray";
	info?: string;
};

export type BaseTextProps<T extends BaseType = "text"> = {
	type: T;
	value: string;
	counter?: number;
	placeholder?: string;
	isClearing?: boolean;
	isSearch?: boolean;
	inputRef?: ForwardedRef<HTMLInputElement>;
	leftIcon?: JSX.Element;
} & BaseProps;

export type BaseNumberProps<T extends BaseType = "number"> = {
	type: T;
	value: string;
	subType: NumberSubType;
	placeholder?: string;
	max?: number;
	min?: number;
	floor?: number;
	hasControls?: boolean;
} & BaseProps;

export type BaseSelectProps<T extends BaseType = "select"> = {
	type: T;
	value: string;
	selectedValue?: React.ReactNode;
	placeholder?: string;
	isClearing?: boolean; //добавляет кнопку очистки значения
	searchValue?: string;
	onChangeSearchValue?: (searchValue: string) => void;
	inputLink?: string;
	linkTarget?: string;
	items: Array<ItemGroup>;
	onReachedBottom?: () => void;
	quantity?: number;
	width?: number;
} & BaseProps;

export type BaseBooleanProps<T extends BaseType = "boolean"> = {
	type: T;
	value: boolean;
} & BaseProps;

export type FieldProps = BaseTextProps | BaseNumberProps | BaseSelectProps | BaseBooleanProps;

export const fieldByType = {
	text: (props: FieldProps) => {
		return <TextField {...(props as BaseTextProps)} />;
	},
	number: (props: FieldProps) => {
		return <NumberField {...(props as BaseNumberProps)} />;
	},
	select: (props: FieldProps) => {
		return <SelectField {...(props as BaseSelectProps)} />;
	},
	boolean: (props: FieldProps) => {
		return <BooleanField {...(props as BaseBooleanProps)} />;
	}
};
