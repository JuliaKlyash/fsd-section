import { useState, useCallback, useMemo, type JSX } from "react";
import classNames from "classnames";

import { ListSearch } from "../list-search";
import { DropdownCounter } from "./dropdown-counter";
import { DropdownItems } from "./dropdown-items";
import { HorizontalDivider } from "@/shared/ui/components/divider";
import { LoadingCircle } from "@/shared/ui/components/loading-circle";


import styles from "./dropdown.module.scss";
import { isUndefined } from "@/shared/lib";

export interface ItemGroup {
	items: Array<JSX.Element>;
	layout: JSX.Element;
}

export interface DropdownContentProps {
	size: 'small' | 'medium' | 'large';
	hasSearch: boolean;
	items: Array<ItemGroup>;
	quantity: number;
	maxHeightItems?: number;
	emptyText?: string;
	searchValue?: string;
	isVisibleCounter?: boolean;
	onChangeSearchValue?: (searchValue: string) => void;
	onReachedBottom?: () => void;
	onClose?: () => void;
}

const EMPTY_COUNT_TEXT = "Поиск не дал результата. Измените поисковой запрос или проверьте справочник.";

export const DropdownContent = (props: DropdownContentProps) => {
	const { size, hasSearch, items, quantity, searchValue, onChangeSearchValue, onClose } = props;
	const [isSearchLoading, setSearchLoading] = useState(false);

	/**@description метод, вызываемый при изменении поискового запроса */
	const handleSearch = useCallback(
		(value: string) => {
			setSearchLoading(true);
			onChangeSearchValue?.(value);
			setSearchLoading(false);
		},
		[onChangeSearchValue]
	);

	/**@description метод, вызываемый при достижении конца списка */
	const handleReachedBottom = useCallback(() => {
		props.onReachedBottom?.();
	}, [props.onReachedBottom]);

	/**@description тело дропдауна */
	const body = useMemo(() => {
		const noMatches = classNames(styles[`${size}CounterText`], styles.noMatches);

		return quantity === 0 ? (
			<span className={noMatches}>{props.emptyText ?? EMPTY_COUNT_TEXT}</span>
		) : isSearchLoading ? (
			<div className={styles.circle}>
				<LoadingCircle size="24" />
			</div>
		) : (
			<DropdownItems
				size={size}
				hasSearch={hasSearch}
				items={items}
				maxHeightItems={props.maxHeightItems}
				isVisibleCounter={props.isVisibleCounter}
				onReachedBottom={handleReachedBottom}
				onClose={onClose}
			/>
		);
	}, [
		size,
		hasSearch,
		items,
		quantity,
		isSearchLoading,
		props.maxHeightItems,
		props.isVisibleCounter,
		props.emptyText,
		handleReachedBottom,
		onClose
	]);

	/**@description отслеживание видимости счетчика */
	const isVisibleCounter = useMemo(() => {
		if (isUndefined(props.isVisibleCounter)) {
			return !isSearchLoading && quantity !== 0 && hasSearch;
		} else {
			return props.isVisibleCounter && !isSearchLoading && quantity !== 0 && hasSearch;
		}
	}, [props, isSearchLoading, quantity, hasSearch]);

	/**@description отслеживание количества item-ов */
	const counter = useMemo(() => {
		return quantity ?? items.reduce((acc, group) => acc + group.items.length, 0);
	}, [quantity, items, searchValue]);
	return (
		<>
			{hasSearch && (
				<>
					<ListSearch size={size} searchValue={searchValue ?? ""} onChangeSearchValue={handleSearch} />
					<HorizontalDivider />
				</>
			)}
			{body}
			{isVisibleCounter && <DropdownCounter size={size} count={counter} />}
		</>
	);
};
