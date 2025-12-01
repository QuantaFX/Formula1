const file = Bun.file("./race-sched.json");
const data = await file.json();

data.forEach(async (session, i, _) => {
	const filename = `session-results/round${i + 1}.json`;
	const roundFile = Bun.file(filename);
	const exists = await roundFile.exists();
	if (!exists) {
		const sessionKey = session.session_key;
		const response = await fetch(
			`https://api.openf1.org/v1/session_result?session_key=${sessionKey}`,
		);

		await Bun.write(filename, response);
		await Bun.sleep(3000);
	}
});
