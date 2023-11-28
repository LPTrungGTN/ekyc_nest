import { Module } from '@nestjs/common';
import { AwsController } from '@aws/aws.controller';
import { S3Service } from '@aws/s3/s3.service';
import { ImageService } from '@/image/image.service';

@Module({
  imports: [],
  controllers: [AwsController],
  providers: [S3Service, ImageService],
})
export class AwsModule {}
