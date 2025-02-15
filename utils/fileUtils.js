import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createPathNameWithDatetime(spotName) {
  const now = new Date();

  // Format date and time
  const dateTimeOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', dateTimeOptions);

  // Get weekday separately
  const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
  const weekday = weekdayFormatter.format(now);

  // Create the formatted string
  const formattedDate = dateTimeFormatter.format(now)
    .replace(/:/g, 'h')
    .replace(/\//g, '-');

  // Combine all parts with desired format
  const folderName = `${spotName}_${formattedDate}_${weekday}`;

  // Replace any remaining spaces with underscores
  return folderName.replace(/\s+/g, '_');
}

export function createFolderWithDateTime(spotName) {
  const folderName = createPathNameWithDatetime(spotName);

  // Go up three levels: utils -> wavescreen -> project_parent -> screenshots
  const projectRoot = path.join(__dirname, '..', '..');
  const screenshotsDir = path.join(projectRoot, 'screenshots');
  const folderPath = path.join(screenshotsDir, folderName);

  // Create the screenshots directory if it doesn't exist
  fs.mkdirSync(screenshotsDir, { recursive: true });
  // Create the specific date folder
  fs.mkdirSync(folderPath, { recursive: true });

  return folderPath;
}