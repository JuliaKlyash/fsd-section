import React, { useCallback, useMemo } from "react";

import { HorizontalDivider } from "@/shared/ui/components/divider";
import { ScrollContainer, ScrollContainerType } from "@/shared/ui/components/scroll-container";
import { isUndefined } from "@/shared/lib";

import type { ItemGroup } from "./dropdown";

import styles from "./dropdown.module.scss";

export interface ItemsProps {
	size: 'small' | 'medium' | 'large';
	hasSearch: boolean;
	items: Array<ItemGroup>;
	maxHeightItems?: number;
	isVisibleCounter?: boolean;
	onReachedBottom?: () => void;
	onClose?: () => void;
}

const SEARCH_CONTENT_HEIGHT = 45; // высота считается вместе с divider
const COUNTER_CONTENT_HEIGHT = 49; // высота считается вместе с divider
const MAX_HEIGHT = 304; // дефолтное значение максимальной высоты для появления скролла

export const DropdownItems = (props: ItemsProps) => {
	const isVisibleCounter = useMemo(() => {
		if (isUndefined(props.isVisibleCounter)) {
			return true;
		} else {
			return props.isVisibleCounter;
		}
	}, [props]);

	const itemsHeight = useMemo(() => {
		if (props.hasSearch) {
			if (isVisibleCounter) {
				return (props.maxHeightItems ?? MAX_HEIGHT) - SEARCH_CONTENT_HEIGHT - COUNTER_CONTENT_HEIGHT;
			} else {
				return (props.maxHeightItems ?? MAX_HEIGHT) - SEARCH_CONTENT_HEIGHT;
			}
		} else {
			return props.maxHeightItems ?? MAX_HEIGHT;
		}
	}, [props, isVisibleCounter]);

	const handleReachedBottom = useCallback(() => {
		props.onReachedBottom?.();
	}, [props.onReachedBottom]);

	return (
		<ScrollContainer type={ScrollContainerType.Vertical} onReachedBottom={handleReachedBottom} isInnerContainer>
			<div style={{ maxHeight: `${itemsHeight}px` }}>
				{props.items.map((group, groupIndex) => (
					<React.Fragment key={`group-${groupIndex}`}>
						<div className={styles.body} key={`group-body-${groupIndex}`}>
							{group.layout && React.cloneElement(group.layout, { key: `group-layout-${groupIndex}` })}
							<div onClick={props.onClose}>
								{group.items.map((item, itemIndex) => (
									<div key={`item-${groupIndex}-${itemIndex}`}>{item}</div>
								))}
							</div>
						</div>
						{groupIndex !== props.items.length - 1 && <HorizontalDivider key={`divider-${groupIndex}`} />}
					</React.Fragment>
				))}
			</div>
		</ScrollContainer>
	);
};
