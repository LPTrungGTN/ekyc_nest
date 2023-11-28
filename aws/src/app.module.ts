import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './image/image.service';

import { PrismaService } from '@prisma/prisma.service';
import { AwsModule } from '@aws/aws.module';
import { AzureModule } from './azure/azure.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AwsModule,
    AzureModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImageService, PrismaService],
})
export class AppModule {}
