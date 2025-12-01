const sched = Bun.file("./final-sched.json");
const schedJson = await sched.json();

for (const data of schedJson) {
	const meetingKey = data.meeting_key;
	const sessions = await fetch(
		`https://api.openf1.org/v1/sessions?year=2025&meeting_key=${meetingKey}`,
	);
	Bun.write(`sessions/${meetingKey}.json`, sessions);
	Bun.sleep(1000);
}
