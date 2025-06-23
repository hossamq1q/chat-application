import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

export async function processImage(buffer: any, path: string) {
  const fileName = `${Date.now()}-${uuid()}.jpeg`;
  await sharp(buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/${path}/${fileName}`);
  return fileName;
}

export function deleteFile(file: string, path: string) {
  fs.unlink(`uploads/${path}/${file}`, (error) => {
    if (error) {
      console.log(`Error deleting file: ${error}`);
    }
  });
}



export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashPassword: string) {
  return await bcrypt.compare(rawPassword, hashPassword);
}


