import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '@/aws/s3/s3.service';
import { ImageService } from '@/image/image.service';
import { Card } from '@prisma/client';

@Controller('aws')
export class AwsController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imageService: ImageService,
  ) {
    this.s3Service = s3Service;
    this.imageService = imageService;
  }

  @Get()
  getHello(): string {
    return 'aws works';
  }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: { buffer: Buffer; originalname: string },
  ): Promise<Card> {
    await this.imageService.validateImage(file);
    return this.s3Service.upload(file);
  }
}
