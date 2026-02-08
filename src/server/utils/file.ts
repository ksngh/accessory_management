
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const saveBase64Image = (base64Image: string): string | null => {
  if (!base64Image) {
    return null;
  }

  // The actual base64 content is after the comma
  const base64Data = base64Image.split(';base64,').pop();
  if (!base64Data) {
    return null;
  }

  const imageBuffer = Buffer.from(base64Data, 'base64');
  const fileExtension = base64Image.substring("data:image/".length, base64Image.indexOf(";base64"));
  const filename = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filePath, imageBuffer);

  return `/uploads/images/${filename}`;
};
