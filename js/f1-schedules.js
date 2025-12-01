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
			"list-group-item",
			"list-group-item-action",
			"rounded-3",
		);
		parent.innerHTML = `
            <div class="d-flex flex-row justify-content-between">
                <div class="schedule-main-subcaption text-white-50">ROUND ${i + 1}</div>
                <span class="schedule-main-subcaption text-white-50 px-3 bg-dark rounded-pill">
                    14-16 MAR
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
