for (let i = 1; i <= 23; i++) {
	const file = Bun.file(`session-results/round${i}.json`);
	const data = await file.json();
	for (const driver of data) {
		const driverNumber = driver.driver_number;
		const driverSessionKey = driver.session_key;
		const filename = `drivers/${driverNumber}_${driverSessionKey}.json`;
		const driverFile = Bun.file(filename);
		const exists = await driverFile.exists();
		if (!exists) {
			console.log(
				`Fetching data for driver ${driverNumber} in session ${driverSessionKey}...`,
			);
			const response = await fetch(
				`https://api.openf1.org/v1/drivers?session_key=${driverSessionKey}&driver_number=${driverNumber}`,
			);

			await Bun.write(filename, response);
			console.log("Waiting 1.2 second before the next request...");
			await Bun.sleep(1200);
		} else {
			console.log(`File ${filename} already exists. Skipping.`);
		}
	}
	console.log(`Finished processing round ${i}.`);
}
