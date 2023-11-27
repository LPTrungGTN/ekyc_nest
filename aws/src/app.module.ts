import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { S3Service } from '@/s3/s3.service';
import { UploadController } from '@/upload/upload.controller';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './image/image.service';
import { AzureController } from './azure/azure.controller';
import { AzureService } from './azure/azure.service';
import { ClassifyDocumentService } from './azure/classify-document/classify-document.service';
import { AnalyzeDocumentService } from './azure/analyze-document/analyze-document.service';
import { AnalyzePassportService } from './azure/analyze-passport/analyze-passport.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, UploadController, AzureController],
  providers: [
    AppService,
    S3Service,
    ImageService,
    AzureService,
    ClassifyDocumentService,
    AnalyzeDocumentService,
    AnalyzePassportService,
  ],
})
export class AppModule {}
