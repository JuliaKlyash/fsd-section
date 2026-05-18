import type { StandartItemGroup } from "@/shared/ui/components/button-dropdown";
import { Export, Import, Tools, Trash } from "@/shared/ui/icons";
/**
 * Возвращает экшены по умолчанию и при выбранных записях.
 * @param checkedCount Количество выбранных записей
 */
export const ActionsComponent = (checkedCount: number = 0) => {
	const defaultActions: Array<StandartItemGroup> = [
		{
			header: "",
			items: [
				{
					id: "exportAll",
					name: "Экспортировать всё...",
					icon: <Export size="16" />
				},
				{
					id: "import",
					name: "Импортировать...",
					icon: <Import size="16" />,
					isDisable: true
				}
			]
		},
		{
			header: "",
			items: [
				{
					id: "editSection",
					name: "Редактировать раздел",
					icon: <Tools size="16" />
				}
			]
		}
	];

	const actionsIfChecked: Array<StandartItemGroup> = [
		{
			header: "",
			items: [
				{
					id: "exportWithCount",
					name: `Экспортировать (${checkedCount})`,
					icon: <Export size="16" />
				},
				{
					id: "import",
					name: "Импортировать...",
					icon: <Import size="16" />,
					isDisable: true
				}
			]
		},
		{
			header: "",
			items: [
				{
					id: "delete",
					name: `Удалить (${checkedCount})`,
					icon: <Trash size="16" />,
					isDisable: checkedCount < 1,
					isRed: true
				}
			]
		}
	];

	return { defaultActions, actionsIfChecked };
};
