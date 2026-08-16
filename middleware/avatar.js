import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, path.join(__dirname, "..", "tmp"));
	},
	filename: (_, file, cb) => {
		const extName = path.extname(file.originalname);
		const baseName = path.basename(file.originalname, extName);
		const name = `${baseName}-${crypto.randomUUID()}${extName}`;
		cb(null, name);
	},
});

export default multer({ storage });