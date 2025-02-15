import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import path from 'path';

export async function recordVideo(page, url, folderPath, filename, durationSeconds = 180) {
  const recorder = new PuppeteerScreenRecorder(page);

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  const videoPath = path.join(folderPath, filename);
  await recorder.start(videoPath);

  // Record for specified duration
  await new Promise(resolve => setTimeout(resolve, durationSeconds * 1000));

  await recorder.stop();
}