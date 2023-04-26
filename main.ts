import { Plugin, PluginSettingTab, App, Setting, MarkdownView } from "obsidian";

interface CountdownTimerSettings {
	dateFormat: string;
}

const DEFAULT_SETTINGS: CountdownTimerSettings = {
	dateFormat: "YYYY-MM-DD HH:mm",
};

export default class CountdownTimerPlugin extends Plugin {
	settings: CountdownTimerSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new CountdownTimerSettingTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor(
			"countdown",
			this.insertCountdownTimer.bind(this)
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async insertCountdownTimer(
		source: string,
		el: HTMLElement,
		_: MarkdownView
	) {
		const dateFormat = this.settings.dateFormat;
		const moment = (window as any).moment;
		const [eventName, dateString] = source.trim().split("\n");
		const targetDate = moment(dateString, dateFormat).toDate();

		if (isNaN(targetDate.getTime())) {
			el.innerText = `Invalid date format. Please use the format: ${dateFormat}`;
			return;
		}

		const timerElement = document.createElement("div");
		timerElement.classList.add("countdown-timer");
		el.appendChild(timerElement);

		const eventNameElement = document.createElement("p");
		eventNameElement.classList.add("countdown-timer-event-name");
		timerElement.appendChild(eventNameElement);

		const timeContainerElement = document.createElement("div");
		timeContainerElement.classList.add("countdown-timer-time-container");
		timerElement.appendChild(timeContainerElement);

		const daysElement = document.createElement("span");
		daysElement.classList.add("countdown-timer-days");
		timeContainerElement.appendChild(daysElement);

		const hoursElement = document.createElement("span");
		hoursElement.classList.add("countdown-timer-hours");
		timeContainerElement.appendChild(hoursElement);

		const minutesElement = document.createElement("span");
		minutesElement.classList.add("countdown-timer-minutes");
		timeContainerElement.appendChild(minutesElement);

		const secondsElement = document.createElement("span");
		secondsElement.classList.add("countdown-timer-seconds");
		timeContainerElement.appendChild(secondsElement);

		const updateTimer = () => {
			const now = new Date().getTime();
			const timeRemaining = targetDate.getTime() - now;

			let eventNameString = eventName.toString();
			if (timeRemaining < 0) {
				timerElement.innerHTML = `The countdown to ${eventNameString} is over.`;
				return;
			}

			const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor(
				(timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

			eventNameElement.innerHTML = `<strong>${
				eventName || "Event"
			}</strong>`;
			daysElement.innerHTML = `${days} days `;
			hoursElement.innerHTML = `${hours} hours `;
			minutesElement.innerHTML = `${minutes} minutes `;
			secondsElement.innerHTML = `${seconds} seconds `;

			setTimeout(updateTimer, 1000);
		};

		updateTimer();
	}
}

class CountdownTimerSettingTab extends PluginSettingTab {
	plugin: CountdownTimerPlugin;

	constructor(app: App, plugin: CountdownTimerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Countdown Timer Settings" });

		new Setting(containerEl)
			.setName("Date Format")
			.setDesc(
				"The format to use when parsing dates in the countdown code block."
			)
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD HH:mm")
					.setValue(this.plugin.settings.dateFormat)
					.onChange(async (value) => {
						this.plugin.settings.dateFormat = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
