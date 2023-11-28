import { Module } from '@nestjs/common';
import { AzureController } from '@/azure/azure.controller';
import { AzureService } from '@/azure/azure.service';
import { ClassifyDocumentService } from '@/azure/classify-document/classify-document.service';
import { AnalyzeDocumentService } from '@/azure/analyze-document/analyze-document.service';
import { AnalyzePassportService } from '@/azure/analyze-passport/analyze-passport.service';

@Module({
  imports: [],
  controllers: [AzureController],
  providers: [
    AzureService,
    ClassifyDocumentService,
    AnalyzeDocumentService,
    AnalyzePassportService,
  ],
})
export class AzureModule {}
