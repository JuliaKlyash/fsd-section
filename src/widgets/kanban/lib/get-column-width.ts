import { COLUMNS_GAP, MIN_WIDTH_COLUMN, PADDINGS_COUNT } from "../model/constants";

/**@description Рассчитывает ширину столбца канбана */
export function getColumnWidth(containerWidth: number, columnCount: number, padding = 0): number {
	const widthWithoutPaddings = containerWidth - PADDINGS_COUNT * padding;
	const gaps = (columnCount - 1) * COLUMNS_GAP;
	const availableWidth = widthWithoutPaddings - gaps;

	if (columnCount <= 0) {
		return MIN_WIDTH_COLUMN;
	}

	if (availableWidth / columnCount >= MIN_WIDTH_COLUMN) {
		return availableWidth / columnCount;
	}

	return MIN_WIDTH_COLUMN;
}
