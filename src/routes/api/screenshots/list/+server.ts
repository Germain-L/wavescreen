import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';
import type { ApiResponse, ScreenshotListResponse } from '$types/api';
import * as fs from 'node:fs';

export const GET: RequestHandler = async () => {
	try {
		const screenshotsDir = join(process.cwd(), 'static');

		// Create directory if it doesn't exist
		await fs.promises.mkdir(screenshotsDir, { recursive: true });

		const folders = (await readdir(screenshotsDir, { withFileTypes: true }))
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		const response: ApiResponse<ScreenshotListResponse> = {
			success: true,
			data: { folders }
		};

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Directory error:', error);
		const response: ApiResponse<never> = {
			success: false,
			error: 'Failed to list screenshot folders'
		};
		return new Response(JSON.stringify(response), { status: 500 });
	}
};
