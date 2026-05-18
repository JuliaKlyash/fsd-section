import React from "react";
import { useCallback, useEffect, useRef } from "react";

import { Search } from "@/shared/ui/icons/search";


import styles from "./list-search.module.scss";

export interface ListSearchProps {
	size: 'small' | 'medium' | 'large';
	searchValue: string;
	onChangeSearchValue: (searchValue: string) => void;
	placeholder?: string;
}

export const ListSearch = (props: ListSearchProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	// Устанавливаем фокус на input при инициализации компонента
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			props.onChangeSearchValue(event.target.value);
		},
		[props.onChangeSearchValue]
	);
	return (
		<div className={styles.searchBox}>
			<Search size={props.size === "small" ? "16" : props.size === "medium" ? "24" : "32"} className={styles.searchIcon} />
			<input
				ref={inputRef}
				value={props.searchValue}
				onChange={handleChange}
				placeholder={props.placeholder ?? "Найти"}
				className={styles.input}
			/>
		</div>
	);
};
