import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { S3Service } from '@/s3/s3.service';
import { UploadController } from '@/upload/upload.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, S3Service],
})
export class AppModule {}
