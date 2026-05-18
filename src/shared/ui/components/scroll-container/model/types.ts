export type ScrollProperties = {
	size: number;
	position: number;
	setPosition: (position: number) => void;
};

export enum ScrollType {
	Vertical = "vertical",
	Horizontal = "horizontal"
}

export enum ScrollContainerType {
	Vertical = "vertical",
	Horizontal = "horizontal",
	Auto = "auto"
}

export interface ScrollTrackProps {
	scrollContentRef: HTMLDivElement;
	contentIsHovering: boolean;
	scrollProperties: ScrollProperties;
	handleScroll: () => void;
}
