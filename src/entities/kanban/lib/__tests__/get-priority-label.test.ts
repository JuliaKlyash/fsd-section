import { getPriorityLabel } from "../get-priority-label";

describe("getPriorityLabel", () => {
	it.each([
		["low", "Низкий"],
		["medium", "Средний"],
		["high", "Высокий"],
		["critical", "Критичный"]
	] as const)("возвращает «%s» → «%s»", (priority: "low" | "medium" | "high" | "critical", label: string) => {
		expect(getPriorityLabel(priority)).toBe(label);
	});

	it("возвращает «—», если приоритет не задан", () => {
		expect(getPriorityLabel()).toBe("—");
		expect(getPriorityLabel(undefined)).toBe("—");
	});
});
