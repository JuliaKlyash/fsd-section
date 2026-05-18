import type { Section } from "@entities/section";

const dealsColumns: Section["columns"] = [
	{
		id: "deals-new",
		title: "Новые",
		color: "blue",
		cards: [
			{ id: "d-1", title: "ООО Ромашка", subtitle: "Иван Петров", priority: "high" },
			{ id: "d-2", title: "ТехноПром", subtitle: "Запрос демо CRM", priority: "medium" },
			{ id: "d-3", title: "СтартАп Хаб", subtitle: "Партнёрская программа", priority: "high" },
			{ id: "d-4", title: "Медиа Групп", subtitle: "Елена Волкова", priority: "medium" }
		]
	},
	{
		id: "deals-progress",
		title: "В работе",
		color: "orange",
		cards: [
			{ id: "d-5", title: "Альфа Трейд", subtitle: "Демо завтра 14:00", priority: "critical" },
			{ id: "d-6", title: "СеверСтрой", subtitle: "КП отправлено", priority: "high" },
			{ id: "d-7", title: "Ретейл Сеть", subtitle: "Пилот на 3 филиала", priority: "high" },
			{ id: "d-8", title: "Дельта Импорт", subtitle: "Юридическая проверка", priority: "medium" }
		]
	},
	{
		id: "deals-won",
		title: "Успешно",
		color: "green",
		cards: [
			{ id: "d-9", title: "Бета Логистик", subtitle: "Договор подписан", priority: "low" },
			{ id: "d-10", title: "Вектор IT", subtitle: "Оплата получена", priority: "low" },
			{ id: "d-11", title: "ЭкоМаркет", subtitle: "Upsell +2 модуля", priority: "high" }
		]
	},
	{
		id: "deals-lost",
		title: "Проиграно",
		color: "red",
		cards: [
			{ id: "d-12", title: "Гамма Сервис", subtitle: "Нет бюджета", priority: "medium" },
			{ id: "d-13", title: "Омега Холдинг", subtitle: "Выбрали конкурента", priority: "high" }
		]
	}
];

const requestsColumns: Section["columns"] = [
	{
		id: "req-new",
		title: "Новая",
		color: "blue",
		cards: [
			{ id: "r-1", title: "Заявка #1042", subtitle: "С сайта", priority: "high" },
			{ id: "r-2", title: "Заявка #1089", subtitle: "Email-рассылка", priority: "medium" },
			{ id: "r-3", title: "Звонок 15:30", subtitle: "Входящий", priority: "medium" },
			{ id: "r-4", title: "Заявка #1101", subtitle: "Telegram-бот", priority: "low" }
		]
	},
	{
		id: "req-qualify",
		title: "Квалификация",
		color: "orange",
		cards: [
			{ id: "r-5", title: "Заявка #0998", subtitle: "Уточнение потребности", priority: "high" },
			{ id: "r-6", title: "Заявка #1015", subtitle: "Ожидает ответа клиента", priority: "medium" },
			{ id: "r-7", title: "Заявка #1033", subtitle: "Назначен менеджер", priority: "low" }
		]
	},
	{
		id: "req-converted",
		title: "В сделку",
		color: "green",
		cards: [
			{ id: "r-8", title: "Заявка #0971", subtitle: "Создана сделка", priority: "low" },
			{ id: "r-9", title: "Заявка #1004", subtitle: "Передано в отдел продаж", priority: "medium" }
		]
	},
	{
		id: "req-rejected",
		title: "Отклонена",
		color: "red",
		cards: [
			{ id: "r-10", title: "Заявка #0960", subtitle: "Спам", priority: "low" },
			{ id: "r-11", title: "Заявка #1022", subtitle: "Не целевой сегмент", priority: "medium" }
		]
	}
];

const contactsColumns: Section["columns"] = [
	{
		id: "cnt-new",
		title: "Новые",
		color: "blue",
		cards: [
			{ id: "c-1", title: "Иван Петров", subtitle: "ООО Ромашка · ivan@mail.ru", priority: "medium" },
			{ id: "c-2", title: "Мария Сидорова", subtitle: "Альфа Трейд · +7 900 …", priority: "high" },
			{ id: "c-3", title: "Алексей Козлов", subtitle: "ТехноПром", priority: "low" }
		]
	},
	{
		id: "cnt-active",
		title: "На связи",
		color: "orange",
		cards: [
			{ id: "c-4", title: "Елена Волкова", subtitle: "Медиа Групп · ЛПР", priority: "high" },
			{ id: "c-5", title: "Дмитрий Петров", subtitle: "СеверСтрой", priority: "medium" },
			{ id: "c-6", title: "Ольга Ким", subtitle: "Финанс Плюс", priority: "low" }
		]
	},
	{
		id: "cnt-client",
		title: "Клиенты",
		color: "green",
		cards: [
			{ id: "c-7", title: "Сергей Никифоров", subtitle: "Бета Логистик", priority: "low" },
			{ id: "c-8", title: "Анна Белова", subtitle: "Вектор IT", priority: "medium" }
		]
	},
	{
		id: "cnt-inactive",
		title: "Неактивные",
		color: "grey",
		cards: [
			{ id: "c-9", title: "Пётр Зайцев", subtitle: "Нет ответа 90 дней", priority: "low" },
			{ id: "c-10", title: "Наталья Ильина", subtitle: "Сменила компанию", priority: "medium" }
		]
	}
];

export const sectionsMock: Section[] = [
	{
		id: "deals",
		title: "Сделки",
		entityName: "deal",
		rowCount: 128,
		kanbanIsEnabled: true,
		columns: dealsColumns
	},
	{
		id: "requests",
		title: "Заявки",
		entityName: "request",
		rowCount: 84,
		kanbanIsEnabled: true,
		columns: requestsColumns
	},
	{
		id: "contacts",
		title: "Контакты",
		entityName: "contact",
		rowCount: 256,
		kanbanIsEnabled: true,
		columns: contactsColumns
	}
];

export const defaultSectionId = sectionsMock[0]!.id;
