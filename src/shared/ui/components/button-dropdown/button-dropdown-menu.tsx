
import type { StandartItemGroup } from "./types";
import { DropdownItem } from "../dropdown-item";

import styles from "./button-dropdown-menu.module.scss";

type ButtonDropdownMenuProps = {
	groups: StandartItemGroup[];
	onSelect: (actionId: string) => void;
};

export function ButtonDropdownMenu({ groups, onSelect }: ButtonDropdownMenuProps) {
	return (
		<div className={styles.menu} role="menu">
			{groups.map((group, groupIndex) => (
				<div key={`${group.header}-${groupIndex}`} className={styles.group}>
					{group.header ? <div className={styles.groupHeader}>{group.header}</div> : null}
					{group.items.map((item) => (
						<DropdownItem
							id={item.id}
							title={item.name}
							icon={item.icon}
							isDisabled={item.isDisable}
							onClick={() => onSelect(item.id)}
						/>

					))}
				</div>
			))}
		</div>
	);
}
