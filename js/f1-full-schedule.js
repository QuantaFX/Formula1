async function loadCircuitName() {
	const params = new URLSearchParams(window.location.search);
	const meetingKey = params.get("meeting_key");

	const file = await fetch(`../json/final-sched.json`);
	const data = await file.json();

	const session = data.find((session) => session.meeting_key == meetingKey);

	const circuitName = session.meeting_official_name;
	const header = document.getElementById("circuit-name");
	header.innerHTML = circuitName;
}

async function loadAllSchedule() {
	const params = new URLSearchParams(window.location.search);
	const meetingKey = params.get("meeting_key");

	const file = await fetch(`../json/sessions/${meetingKey}.json`);
	const data = await file.json();
	const schedules = [];
	data.forEach((session) => {
		const dateObj = new Date(session.date_start);
		const dateEndObj = new Date(session.date_end);
		const dateFormatted = dateObj.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});
		const timeStart = dateObj.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		const timeEnd = dateEndObj.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
		const timeStr = `${timeStart}-${timeEnd}`;

		schedules.push({
			name: session.session_name,
			date: dateFormatted,
			time: timeStr,
		});
	});

	const tableBody = document.getElementById("main-schedule");
	let finalHTML = "";
	schedules.forEach((schedule) => {
		finalHTML += `<tr>
            <td>${schedule.name}</td>
            <td>${schedule.date}</td>
            <td>${schedule.time}</td>
        </tr>
        `;
	});
	tableBody.innerHTML = finalHTML;
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

async function loadResults() {
	const params = new URLSearchParams(window.location.search);
	const meetingKey = params.get("meeting_key");

	const file = await fetch(`../json/session-results/${meetingKey}.json`);
	const data = await file.json();
	const results = [];
	for (const driver of data) {
		const driverFile = await fetch(
			`../json/drivers/${driver.driver_number}.json`,
		);
		const driverJson = await driverFile.json();

		results.push({
			position: driver.position,
			fullName: `${driverJson.first_name} ${driverJson.last_name}`,
			teamName: driverJson.team_name,
			time:
				results.length === 0
					? formatTimeSecondsToHMSM(driver.duration)
					: driver.gap_to_leader === null
						? "DNF"
						: `+${driver.gap_to_leader}`,
			points: driver.points,
		});
	}

	const tableBody = document.getElementById("main-results");
	let finalHTML = "";
	let i = 1;
	results.forEach((result) => {
		finalHTML += `${i <= 5 ? "<tr>" : '<tr class="extra" style="display: none;">'}
            <td>${result.position === null ? "NC" : result.position}</td>
            <td>${result.fullName}</td>
            <td>${result.teamName}</td>
            <td>${result.time}</td>
            <td>${result.points}</td>
        </tr>
        `;
		i++;
	});
	tableBody.innerHTML = finalHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
	await loadCircuitName();
	await loadAllSchedule();
	await loadResults();

	const btn = document.getElementById("toggle-standings");
	const extraRows = document.querySelectorAll(".f1-table .extra");

	btn.addEventListener("click", () => {
		const isHidden =
			extraRows[0].style.display === "none" ||
			extraRows[0].style.display === "";

		extraRows.forEach((row) => {
			row.style.display = isHidden ? "table-row" : "none";
		});

		btn.textContent = isHidden ? "Show Less ▲" : "Show All ▼";
	});
});
