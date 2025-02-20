import { readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import type { RequestHandler } from '@sveltejs/kit';
import type { ApiResponse, FolderImagesResponse } from '$types/api';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const folderPath = join(process.cwd(), 'static', params.folder ?? '');
		const files = await readdir(folderPath);

		const images = files.filter((file) =>
			['.webp', '.png', '.jpg'].includes(extname(file).toLowerCase())
		);

		const response: ApiResponse<FolderImagesResponse> = {
			success: true,
			data: { images }
		};

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		const response: ApiResponse<never> = {
			success: false,
			error: 'Failed to load folder images'
		};
		return new Response(JSON.stringify(response), { status: 500 });
	}
};
