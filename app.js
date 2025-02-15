import { createFolderWithDateTime } from './utils/fileUtils.js';
import { takeSingleScreenshot, takeMultipleScreenshots } from './services/screenshotService.js';

const SPOT_NAME = "Cotso";

// NOTE: you can add the website you want and customize the way it screenshot it
async function takeScreenshots() {
  const windguruUrl = 'https://www.windguru.cz/48534';
  const windyUrl = 'https://www.windy.com/?gfs,45.702,-1.315,12,i:pressure,m:eVkaf63';
  const videoUrl = 'https://platforms5.joada.net/embeded/embeded.html?uuid=ad03f083-fb37-4bd5-3130-3330-6d61-63-b08c-4386fcde48f4d&type=live&liveicon=1&vsheader=1&tz=Europe/Paris&tsp=1738286983&titletext=';
  const boueeUrl = 'https://www.allosurf.net/meteo/live/oleron-large-bouee-fr-01704.html';
  const mareeUrl = 'https://maree.info/131';

  try {
    console.log('Starting screenshot process...');
    const folderPath = createFolderWithDateTime('Cotso');

    console.log('Taking screenshots sequentially...');

    // Prendre les captures une par une
    console.log('Taking Windguru screenshot...');
    await takeSingleScreenshot(windguruUrl, folderPath, 'windguru.webp');

    console.log('Taking Windy screenshot...');
    await takeSingleScreenshot(windyUrl, folderPath, 'windy.webp');

    console.log('Taking Bouee screenshot...');
    await takeSingleScreenshot(boueeUrl, folderPath, 'bouee.webp');

    console.log('Taking Maree screenshot...');
    await takeSingleScreenshot(mareeUrl, folderPath, 'maree.webp');

    console.log('All static screenshots completed. Starting video screenshots...');
    await takeMultipleScreenshots(videoUrl, folderPath, 'webcam', 10, 3);

    console.log('All screenshots completed successfully');
  } catch (error) {
    console.error('Error during screenshot process:', error);
    throw error;
  }
}

// Main execution
console.log('Starting application...');
takeScreenshots()
  .then(() => {
    console.log('Process completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Process failed:', error);
    process.exit(1);
  });