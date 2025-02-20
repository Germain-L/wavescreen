import path from 'path';
import puppeteer from 'puppeteer';
import { createFolderWithDateTime } from './fileUtils';

export const screenshotService = {
	async captureAll() {
		const SPOT_NAME = 'Cotso';
		const folderPath = createFolderWithDateTime(SPOT_NAME);

		const windguruUrl = 'https://www.windguru.cz/48534';
		const windyUrl = 'https://www.windy.com/?gfs,45.702,-1.315,12,i:pressure,m:eVkaf63';
		const videoUrl =
			'https://platforms5.joada.net/embeded/embeded.html?uuid=ad03f083-fb37-4bd5-3130-3330-6d61-63-b08c-4386fcde48f4d&type=live&liveicon=1&vsheader=1&tz=Europe/Paris&tsp=1738286983&titletext=';
		const boueeUrl = 'https://www.allosurf.net/meteo/live/oleron-large-bouee-fr-01704.html';
		const mareeUrl = 'https://maree.info/131';

		return {
			folderPath,
			screenshots: [
				await this.captureSingle(windguruUrl, path.join(folderPath, 'windguru.webp')),
				await this.captureSingle(windyUrl, path.join(folderPath, 'windy.webp')),
				await this.captureSingle(videoUrl, path.join(folderPath, 'video.webp')),
				await this.captureSingle(boueeUrl, path.join(folderPath, 'bouee.webp')),
				await this.captureSingle(mareeUrl, path.join(folderPath, 'maree.webp'))
			]
		};
	},

	async captureSingle(url: string, outputPath: string) {
		const browser = await puppeteer.launch({
			headless: true, // Changed from "new" to boolean true
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
			]
		});

		try {
			const page = await browser.newPage();
			await page.goto(url, {
				waitUntil: 'networkidle2',
				timeout: 60000
			});

			await page.screenshot({
				path: outputPath,
				fullPage: true,
				type: 'webp',
				quality: 80
			});

			return path.basename(outputPath);
		} finally {
			await browser.close();
		}
	}
};
