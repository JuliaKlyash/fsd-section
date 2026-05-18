import { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import type { Section } from "@entities/section";
import { ViewMode } from "@entities/view-mode";
import { Button } from "@shared/ui/components/button";
import { Field } from "@/shared/ui/components/field";
import { Switcher, type SwitchElement } from "@shared/ui/components/switcher";

import { ActionsMenu } from "./actions-menu";

import styles from "./head-island.module.scss";

type HeadIslandSize = "small" | "medium" | "large";

interface HeadIslandProps {
	size: HeadIslandSize;
	section: Section;
	sections: Section[];
	activeSectionId: string;
	onSectionChange: (sectionId: string) => void;
	hasKanban: boolean;
	viewModeValue: ViewMode;
	onSwitchViewMode: (value: ViewMode) => void;
}

function getViewModeElements(hasKanban: boolean): SwitchElement[] {
	return [
		{ id: ViewMode.GRID, text: "Таблица", disabled: false },
		{ id: ViewMode.KANBAN, text: "Канбан", disabled: !hasKanban }
	];
}

/**@description Остров вверху страницы */
export function HeadIsland({
	size,
	section,
	sections,
	activeSectionId,
	onSectionChange,
	hasKanban,
	onSwitchViewMode,
	viewModeValue,
}: HeadIslandProps) {
	const [searchValue, setSearchValue] = useState("");
	const [checkedRowsCount, setCheckedRowsCount] = useState(0);

	const viewModeElements = useMemo(() => getViewModeElements(hasKanban), [hasKanban]);

	const titleClassName = classNames(styles.title, styles[`title${size}`]);

	const handleAction = useCallback(
		(actionId: string) => {
			switch (actionId) {
				case "exportAll":
					setCheckedRowsCount(section.rowCount);
					return;
				case "exportWithCount":
					console.info("[mock] export", { sectionId: section.id, checkedRowsCount });
					return;
				case "delete":
					console.info("[mock] delete", { sectionId: section.id, checkedRowsCount });
					setCheckedRowsCount(0);
					return;
				case "editSection":
					console.info("[mock] edit section", { entityName: section.entityName });
					return;
				default:
					return;
			}
		},
		[checkedRowsCount, section.entityName, section.id, section.rowCount]
	);

	const handleViewModeSwitch = useCallback(
		(value: string) => {
			onSwitchViewMode(value as ViewMode);
		},
		[onSwitchViewMode]
	);

	const handleSectionChange = useCallback(
		(sectionId: string) => {
			onSectionChange(sectionId);
			setCheckedRowsCount(0);
			setSearchValue("");
		},
		[onSectionChange]
	);

	return (
		<div className={styles.container}>
			<div className={styles.block}>
				<div className={styles.headControllers}>
					<h1 className={titleClassName}>{section.title}</h1>
					<ActionsMenu checkedCount={checkedRowsCount} onSelect={handleAction} />
				</div>
				<div className={styles.rightBlock}>
					<Field
						type="text"
						isSearch
						isClearing
						value={searchValue}
						placeholder="Искать..."
						size="small"
						onChange={setSearchValue}
					/>
					<Switcher size={size} value={viewModeValue} onSwitch={handleViewModeSwitch} elements={viewModeElements} />
				</div>
			</div>
			<div className={classNames(styles.block, styles.secondRow)}>
				<div className={styles.sections}>
					{sections.map((item) => (
						<Button
							key={item.id}
							size="small"
							variant={item.id === activeSectionId ? "caution" : "backless"}
							border
							text={item.title}
							className={classNames(styles.sectionButton, {
								[styles.sectionButtonActive]: item.id === activeSectionId
							})}
							onClick={() => handleSectionChange(item.id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
