import { screenshotService } from '$lib/server/screenshotService';
import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

export const POST: RequestHandler = async () => {
	try {
		const result = await screenshotService.captureAll();
		return new Response(
			JSON.stringify({
				success: true,
				data: {
					folder: path.basename(result.folderPath),
					count: result.screenshots.length
				}
			})
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				error: error instanceof Error ? error.message : 'Capture failed'
			}),
			{ status: 500 }
		);
	}
};
