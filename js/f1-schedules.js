export async function loadSchedule() {
	const response = await fetch("../json/final-sched.json");
	if (!response) {
		console.error("Error opening file: ", response.status);
		return;
	}
	const parsedData = await response.json();

	const container = document.getElementById("f1-schedule-list");
	parsedData.forEach((data) => {
		const newDiv = document.createElement("div");
		newDiv.classList.add("bg-primary");
		newDiv.textContent = data.circuit_short_name;

		container.appendChild(newDiv);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	await loadSchedule();
});
