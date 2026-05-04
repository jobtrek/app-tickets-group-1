import { fileTypeFromBuffer } from "file-type";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { errorResponse } from "./responseFactory";

export const handleImageUpload = async (
	file: File,
): Promise<string | Response> => {
	if (file.size > 10 * 1024 * 1024) {
		return errorResponse("File too large (Max 10MB)", 400);
	}

	const buffer = new Uint8Array(await file.arrayBuffer());
	const detectedType = await fileTypeFromBuffer(buffer);
	const allowedMimeTypes = [
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/webp",
	];

	if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
		return errorResponse("Security Error: Invalid file content.", 400);
	}

	const fileName = `${crypto.randomUUID()}.${detectedType.ext}`;
	const uploadDir = path.join(import.meta.dir, "..", "..", "uploads");
	await mkdir(uploadDir, { recursive: true });
	await Bun.write(path.join(uploadDir, fileName), buffer);
	return fileName;
};
