import type { JSX } from "react";

export type StandartItem = {
	id: string;
	name: string;
	icon?: JSX.Element;
	isDisable?: boolean;
	isRed?: boolean;
};

export type StandartItemGroup = {
	header: string;
	items: StandartItem[];
};
