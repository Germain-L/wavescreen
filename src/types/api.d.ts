export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface ScreenshotListResponse {
	folders: string[];
}

export interface FolderImagesResponse {
	images: string[];
}
