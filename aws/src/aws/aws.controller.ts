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
import { Rekognition } from 'aws-sdk';

@Controller('aws')
export class AwsController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imageService: ImageService,
  ) {}

  @Get()
  getHello(): string {
    return 'aws works';
  }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: { buffer: Buffer; originalname: string },
  ): Promise<Rekognition.DetectFacesResponse> {
    await this.imageService.validateImage(file);
    return this.s3Service.upload(file);
  }
}
