import { Glob } from "bun";

const prompt = "Type the driver number that you want to merge: ";
process.stdout.write(prompt);
for await (const line of console) {
	const glob = new Glob(`${line}_*.json`);
	let mergedDriver = "none";
	for await (const file of glob.scan("drivers/")) {
		console.log(`Processing file ${file}...`);
		const driverFile = Bun.file(`drivers/${file}`);
		const driverParsed = await driverFile.json();
		const sessionKey = driverParsed[0].session_key;
		const meetingKey = driverParsed[0].meeting_key;

		if (mergedDriver === "none") {
			mergedDriver = driverParsed;
			mergedDriver = mergedDriver[0];
			delete mergedDriver.session_key;
			delete mergedDriver.meeting_key;
			mergedDriver.session_keys = [sessionKey];
			mergedDriver.meeting_keys = [meetingKey];
		} else {
			mergedDriver.session_keys.push(sessionKey);
			mergedDriver.meeting_keys.push(meetingKey);
		}
	}

	const merged = Bun.file(`drivers/merged-${line}.json`);
	const exists = await merged.exists();
	if (!exists) {
		console.log(`Finalizing the merged output.`);
		const jsonStr = JSON.stringify(mergedDriver, null, 4);
		await Bun.write(merged, jsonStr);
	}

	for await (const file of glob.scan("drivers/")) {
		console.log(`Cleanup. Deleting all files.`);
		const driverFile = Bun.file(`drivers/${file}`);
		await driverFile.delete();
	}

	process.stdout.write(prompt);
}
