function formatDate(dateStart, dateEnd) {
	const dateStartObj = new Date(dateStart);
	const dateEndObj = new Date(dateEnd);
	const dateStartMonth = dateStartObj.getMonth() + 1;
	const dateEndMonth = dateEndObj.getMonth() + 1;
	if (dateStartMonth === dateEndMonth) {
		const dateStr =
			dateStartObj.toLocaleString("en-US", { month: "short" }).toUpperCase() +
			" " +
			dateStartObj.getDate().toString() +
			"-" +
			dateEndObj.getDate().toString();
		return dateStr;
	} else {
		const dateStr =
			dateStartObj.toLocaleString("en-US", { month: "short" }).toUpperCase() +
			" " +
			dateStartObj.getDate().toString() +
			"-" +
			dateEndObj.toLocaleString("en-US", { month: "short" }).toUpperCase() +
			" " +
			dateEndObj.getDate().toString();
		return dateStr;
	}
}

export async function loadSchedule() {
	const response = await fetch("../json/final-sched.json");
	if (!response) {
		console.error("Error opening file: ", response.status);
		return;
	}
	const parsedData = await response.json();

	const container = document.getElementById("f1-schedule-list");
	parsedData.forEach((data, i, _) => {
		const parent = document.createElement("div");
		parent.classList.add(
			"schedule-main-item",
			"px-3",
			"py-5",
			"mb-3",
			"rounded-3",
		);
		parent.innerHTML = `
            <div class="d-flex flex-row justify-content-between">
                <div class="schedule-main-subcaption text-white-50">ROUND ${i + 1}</div>
                <span class="schedule-main-subcaption text-white-50 px-3 bg-dark rounded-pill">
                    ${formatDate(data.date_start, data.date_end)}
                </span>
            </div>
            <div class="schedule-main-caption text-white fs-3 fw-bold">${data.country_name}</div>
            <span class="schedule-main-desc text-white-50 fw-semibold">
                ${data.meeting_official_name}
            </span>
        `;

		container.appendChild(parent);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	await loadSchedule();
});
