import { Injectable, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Metadata } from 'sharp';

@Injectable()
export class ImageService {
  public async validateImage(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<Metadata> {
    try {
      return await sharp(file.buffer).metadata();
    } catch (error) {
      throw new BadRequestException('You need send image');
    }
  }

  public async saveImage(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<string> {
    const imagePath = join(
      process.cwd(),
      'src',
      'public',
      'image',
      file.originalname,
    );
    try {
      await writeFile(imagePath, file.buffer);
      return imagePath;
    } catch (error) {
      console.log('🚀 ~ file: image.service.ts ~ ImageService ~ error:', error);
      throw new BadRequestException('Error saving image');
    }
  }
}
