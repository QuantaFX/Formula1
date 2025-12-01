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

function formatTimeSecondsToHMSM(totalSeconds) {
	if (totalSeconds < 0) {
		return "Time must be non-negative";
	}

	const wholeSeconds = Math.floor(totalSeconds);
	const milliseconds = Math.round((totalSeconds - wholeSeconds) * 1000);
	const hours = Math.floor(wholeSeconds / 3600);
	const secondsAfterHours = wholeSeconds % 3600;
	const minutes = Math.floor(secondsAfterHours / 60);
	const seconds = secondsAfterHours % 60;

	const formattedMinutes = String(minutes).padStart(2, "0");
	const formattedSeconds = String(seconds).padStart(2, "0");
	const formattedMilliseconds = String(milliseconds).padStart(3, "0");

	return `${hours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

async function retrieveTopThree(meetingKey) {
	const file = await fetch(`../json/session-results/${meetingKey}.json`);
	const data = await file.json();
	const results = [];

	for (let i = 0; i < 3; i++) {
		const driver = data[i];
		const driverFile = await fetch(
			`../json/drivers/${driver.driver_number}.json`,
		);
		const driverJson = await driverFile.json();
		const lastName = driverJson.last_name.toUpperCase();

		results.push({
			position: driver.position,
			lastName: lastName,
			teamColor: driverJson.team_colour,
			time:
				results.length === 0
					? formatTimeSecondsToHMSM(driver.duration)
					: driver.gap_to_leader === null
						? "DNF"
						: `+${driver.gap_to_leader}`,
			headshot: driverJson.headshot_url,
		});
	}

	return results;
}

function getPosition(pos) {
	if (pos === 1) return "1st";
	else if (pos === 2) return "2nd";
	else return "3rd";
}

export async function loadSchedule() {
	const response = await fetch("../json/final-sched.json");
	if (!response) {
		console.error("Error opening file: ", response.status);
		return;
	}
	const parsedData = await response.json();

	const container = document.getElementById("f1-schedule-list");
	let i = 0;

	for (const data of parsedData) {
		const parent = document.createElement("div");
		parent.classList.add(
			"schedule-main-item",
			"px-3",
			"py-4",
			"mb-3",
			"rounded-3",
		);
		parent.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url('${data.media}')`;
		parent.style.backgroundSize = "cover";
		parent.style.backgroundPosition = "center";

		const topThree = await retrieveTopThree(data.meeting_key);

		let thumbnailHTML = "";
		for (const driver of topThree) {
			thumbnailHTML += `
        <div class="placement-thumbnail rounded-3 d-flex flex-row px-3 py-2 mx-2">
            <img src="${driver.headshot}"
                alt="Max Verstappen" class="rounded-circle mx-2" height="75" width="75" style="background-color: #${driver.teamColor};">
            <div class="d-flex flex-column">
                <div class="text-md">${getPosition(driver.position)}</div>
                <div class="text-md">${driver.lastName}</div>
                <div class="text-md">${driver.time}</div>
            </div>
        </div>`;
		}

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
                    ${thumbnailHTML}
                </div>
            </div>
        `;
		container.appendChild(parent);
		i++;
	}
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
