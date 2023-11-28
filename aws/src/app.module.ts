import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './image/image.service';

import { AzureModule } from '@/azure/azure.module';
import { AwsModule } from '@aws/aws.module';
import { CardModule } from '@/card/card.module';
import { PrismaService } from '@prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AwsModule,
    AzureModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImageService, PrismaService],
})
export class AppModule {}
