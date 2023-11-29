import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '@/aws/s3/s3.service';
import { Card } from '@prisma/client';

@Controller('aws')
export class AwsController {
  constructor(private readonly s3Service: S3Service) {
    this.s3Service = s3Service;
  }

  @Get()
  getHello(): string {
    return 'aws works';
  }

  @Post('/straight_face')
  @UseInterceptors(FileInterceptor('file'))
  async straightFace(
    @UploadedFile() file: { buffer: Buffer; originalname: string },
  ): Promise<Card> {
    return this.s3Service.checkStraightFace(file);
  }

  @Post('/side_face')
  @UseInterceptors(FileInterceptor('file'))
  async sideFace(
    @UploadedFile() file: { buffer: Buffer; originalname: string },
  ): Promise<Card> {
    return this.s3Service.checkSideFace(file);
  }
}
