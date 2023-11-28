import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './image/image.service';
import { AzureController } from './azure/azure.controller';
import { AzureService } from './azure/azure.service';
import { ClassifyDocumentService } from './azure/classify-document/classify-document.service';
import { AnalyzeDocumentService } from './azure/analyze-document/analyze-document.service';
import { AnalyzePassportService } from './azure/analyze-passport/analyze-passport.service';
import { PrismaService } from '@prisma/prisma.service';
import { AwsController } from '@aws/aws.controller';
import { S3Service } from '@aws/s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AzureController, AwsController],
  providers: [
    AppService,
    S3Service,
    ImageService,
    AzureService,
    ClassifyDocumentService,
    AnalyzeDocumentService,
    AnalyzePassportService,
    PrismaService,
  ],
})
export class AppModule {}
