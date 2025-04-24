
import multer from "multer";

const storage = multer.memoryStorage(); // no disk storage, just parsing
const upload = multer({ storage });

export const parseFormData = upload.none(); // only parse fields, not files
