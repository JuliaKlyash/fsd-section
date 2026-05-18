import type { Section } from "@entities/section";
import type { ViewMode } from "@entities/view-mode";

import { HeadIsland } from "../head-island";

import style from "./control-panel.module.scss";

interface ControlPanelProps {
	section: Section;
	sections: Section[];
	activeSectionId: string;
	onSectionChange: (sectionId: string) => void;
	kanbanIsEnabled: boolean;
	viewMode: ViewMode;
	setViewMode: (value: ViewMode) => void;
}

/**@description Панель управления */
export function ControlPanel({
	section,
	sections,
	activeSectionId,
	onSectionChange,
	kanbanIsEnabled,
	viewMode,
	setViewMode
}: ControlPanelProps) {
	return (
		<div className={style.controlPanel}>
			<HeadIsland
				section={section}
				sections={sections}
				activeSectionId={activeSectionId}
				onSectionChange={onSectionChange}
				hasKanban={kanbanIsEnabled}
				size="small"
				onSwitchViewMode={setViewMode}
				viewModeValue={viewMode}
			/>
		</div>
	);
}
