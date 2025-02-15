import path from 'path';
import puppeteer from 'puppeteer';
// import { getRandomProxy } from '../utils/proxyUtils.js';

function getDateTimePrefix() {
  const now = new Date();

  // Format date and time
  const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get weekday separately
  const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
  const weekday = weekdayFormatter.format(now);

  // Format the date string
  const formattedDate = dateTimeFormatter.format(now)
    .replace(/:/g, 'h')
    .replace(/\//g, '-');

  return formattedDate;  // Retourne juste la date formatée
}

async function createBrowser() {
  return await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // `--proxy-server=${getRandomProxy()}`
    ],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  });
}

/**
 * Takes a single screenshot of a webpage
 * @param {string} url - URL to screenshot
 * @param {string} folderPath - Where to save the screenshot
 * @param {string} filename - Name of the screenshot file
 */
export async function takeSingleScreenshot(url, folderPath, filename) {
  const browser = await createBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    const screenshotPath = path.join(folderPath, filename);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'webp',
      quality: 80
    });
  } finally {
    await browser.close();
  }
}

/**
 * Takes multiple screenshots of a webpage at regular intervals
 * @param {string} url - URL to screenshot
 * @param {string} folderPath - Where to save the screenshots
 * @param {string} baseFilename - Base name for screenshot files
 * @param {number} intervalSeconds - Seconds between screenshots
 * @param {number} durationMinutes - Total duration in minutes
 */
export async function takeMultipleScreenshots(url, folderPath, baseFilename, intervalSeconds = 10, durationMinutes = 3) {
  const totalScreenshots = Math.floor((durationMinutes * 60) / intervalSeconds);
  console.log(`Starting video capture: ${totalScreenshots} screenshots planned`);

  for (let i = 0; i < totalScreenshots; i++) {
    console.log(`Taking video screenshot ${i + 1}/${totalScreenshots}`);
    const browser = await createBrowser();
    const page = await browser.newPage();

    try {
      // Ajouter un timeout pour page.goto
      await Promise.race([
        page.goto(url, { waitUntil: 'networkidle2' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Navigation timeout')), 30000)
        )
      ]);

      // Attendre la vidéo avec timeout
      await Promise.race([
        page.waitForSelector('video'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Video not found')), 10000)
        )
      ]);

      // Démarrer la vidéo avec timeout
      await Promise.race([
        page.evaluate(() => {
          const video = document.querySelector('video');
          if (!video) throw new Error('Video element not found');
          video.play();
          return new Promise(resolve => {
            video.onplaying = resolve;
          });
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Video play timeout')), 10000)
        )
      ]);

      // Attendre que la vidéo se lance
      await new Promise(resolve => setTimeout(resolve, 2000));

      const screenshotPath = path.join(folderPath, `${baseFilename}_${i + 1}.webp`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'webp',
        quality: 80
      });

      console.log(`Screenshot ${i + 1} saved successfully`);

      if (i < totalScreenshots - 1) {
        await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
      }
    } catch (error) {
      console.error(`Error taking screenshot ${i + 1}:`, error.message);
    } finally {
      await browser.close();
    }
  }

  console.log('Video capture completed');
}