import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ButtonDropdownMenu } from "@/shared/ui/components/button-dropdown";
import { ChevronCompactDown } from "@/shared/ui/icons/chevron-compact-down";
import { Button } from "@/shared/ui/components/button";

import { ActionsComponent } from "../dropdown-components";

import styles from "./actions-menu.module.scss";

type ActionsMenuProps = {
	checkedCount: number;
	onSelect: (actionId: string) => void;
};

/**@description Меню действий, выпадающий из кнопки возле заголовка раздела */
export function ActionsMenu({ checkedCount, onSelect }: ActionsMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const wrapRef = useRef<HTMLDivElement>(null);

	const { defaultActions, actionsIfChecked } = useMemo(() => ActionsComponent(checkedCount), [checkedCount]);
	const groups = checkedCount > 0 ? actionsIfChecked : defaultActions;

	const handleSelect = useCallback(
		(actionId: string) => {
			onSelect(actionId);
			setIsOpen(false);
		},
		[onSelect]
	);

	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (event: MouseEvent) => {
			if (!wrapRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, [isOpen]);

	return (
		<div className={styles.wrap} ref={wrapRef}>
			<Button
				size="small"
				variant="backless"
				border
				leftIcon={<ChevronCompactDown size="16" />}
				onClick={() => setIsOpen((open) => !open)}
			/>
			{isOpen ? (
				<div className={styles.dropdown}>
					<ButtonDropdownMenu groups={groups} onSelect={handleSelect} />
				</div>
			) : null}
		</div>
	);
}
