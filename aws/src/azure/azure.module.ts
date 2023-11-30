import { Module } from '@nestjs/common';
import { AzureController } from '@/azure/azure.controller';
import { AzureService } from '@/azure/azure.service';
import { ClassifyDocumentService } from '@/azure/classify-document/classify-document.service';
import { AnalyzeDocumentService } from '@/azure/analyze-document/analyze-document.service';
import { AnalyzePassportService } from '@/azure/analyze-passport/analyze-passport.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DeleteImageService } from './delete-image/delete-image.service';
@Module({
  imports: [],
  controllers: [AzureController],
  providers: [
    AzureService,
    ClassifyDocumentService,
    AnalyzeDocumentService,
    AnalyzePassportService,
    PrismaService,
    DeleteImageService,
  ],
})
export class AzureModule {}
