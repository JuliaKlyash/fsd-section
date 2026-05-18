import { useCallback, useMemo, useState } from "react";

import { ViewMode } from "@entities/view-mode";

import { Kanban } from "@/widgets/kanban";
import { SectionGrid } from "@/widgets/section-grid";

import { ControlPanel } from "@/features/control-panel";

import { defaultSectionId, sectionsMock } from "../model";

import styles from "./home-page.module.scss";

export function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  const [activeSectionId, setActiveSectionId] = useState(defaultSectionId);

  const activeSection = useMemo(
    () => sectionsMock.find((section) => section.id === activeSectionId) ?? sectionsMock[0]!,
    [activeSectionId]
  );

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  const handleViewModeChange = useCallback(
    (value: ViewMode) => {
      if (value === ViewMode.KANBAN && !activeSection.kanbanIsEnabled) {
        return;
      }

      setViewMode(value);
    },
    [activeSection.kanbanIsEnabled]
  );

  return (
    <div className={styles.sectionPage}>
      <ControlPanel
        section={activeSection}
        sections={sectionsMock}
        activeSectionId={activeSectionId}
        onSectionChange={handleSectionChange}
        kanbanIsEnabled={activeSection.kanbanIsEnabled}
        viewMode={viewMode}
        setViewMode={handleViewModeChange}
      />
      <div className={styles.content}>
        {viewMode === ViewMode.KANBAN ? (
          <Kanban key={activeSectionId} initialColumns={activeSection.columns} />
        ) : (
          <SectionGrid key={activeSectionId} columns={activeSection.columns} />
        )}
      </div>
    </div>
  );
}
