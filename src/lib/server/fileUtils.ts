// src/lib/server/fileUtils.ts
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createFolderWithDateTime(spotName: string) {
	const now = new Date();

	// Date formatting
	const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });

	const formattedDate = dateFormatter.format(now).replace(/:/g, 'h').replace(/\//g, '-');

	const weekday = weekdayFormatter.format(now);

	const folderName = `${spotName}_${formattedDate}_${weekday}`;
	const screenshotsDir = path.join(process.cwd(), 'static');
	const folderPath = path.join(screenshotsDir, folderName);

	fs.mkdirSync(screenshotsDir, { recursive: true });
	fs.mkdirSync(folderPath, { recursive: true });

	return folderPath;
}
