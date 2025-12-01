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
			"py-4",
			"mb-3",
			"rounded-3",
		);
		parent.innerHTML = `
        <a href="schedule.html?meeting_key=${data.meeting_key}" class="stretched-link"></a>
            <div class="d-flex flex-row justify-content-between">
                <div class="schedule-main-subcaption text-white-50">ROUND ${i + 1}</div>
                <span class="schedule-main-subcaption text-white-50 px-3 bg-dark rounded-pill">
                    ${formatDate(data.date_start, data.date_end)}
                </span>
            </div>
            <div class="schedule-main-caption text-white fs-3 fw-bold">${data.country_name}</div>
            <div class="d-flex flex-column">
                <div class="schedule-main-desc text-white-50 fw-semibold mb-4">
                    ${data.meeting_official_name}
                </div>
                <div class="d-sm-flex flex-row align-items-center py-0">
                    <div class="placement-thumbnail rounded-3 d-flex flex-row px-3 mx-2 bg-dark">
                        <img src="https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png"
                            alt="Max Verstappen" class="rounded-circle" height="75" width="75">
                        <div class="d-flex flex-column">
                            <div class="text-md">1st</div>
                            <div class="text-md">NORRIS</div>
                            <div class="text-md">1:42:06.304</div>
                        </div>
                    </div>
                    <div class="placement-thumbnail rounded-3 d-flex flex-row px-3 mx-2 bg-dark">
                        <img src="https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png"
                            alt="Max Verstappen" class="rounded-circle" height="75" width="75">
                        <div class="d-flex flex-column">
                            <div class="text-md">1st</div>
                            <div class="text-md">NORRIS</div>
                            <div class="text-md">1:42:06.304</div>
                        </div>
                    </div>
                    <div class="placement-thumbnail rounded-3 d-flex flex-row px-3 mx-2 bg-dark">
                        <img src="https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png"
                            alt="Max Verstappen" class="rounded-circle" height="75" width="75">
                        <div class="d-flex flex-column">
                            <div class="text-md">1st</div>
                            <div class="text-md">NORRIS</div>
                            <div class="text-md">1:42:06.304</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

		container.appendChild(parent);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	await loadSchedule();
});

// document.querySelectorAll(".view").forEach((button) => {
// 	button.addEventListener("click", () => {
// 		const location = button.dataset.location; // gets the data-location
// 		window.location.href = `view.html?location=${location}`;
// 	});
// });
