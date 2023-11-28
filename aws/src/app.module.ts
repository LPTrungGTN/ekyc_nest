import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { S3Service } from '@/s3/s3.service';
import { UploadController } from '@/upload/upload.controller';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './image/image.service';
import { AzureModule } from './azure/azure.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AzureModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, S3Service, ImageService],
})
export class AppModule {}
