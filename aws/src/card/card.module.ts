import { Module } from '@nestjs/common';
import { CardService } from '@/card/card.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [CardService, PrismaService],
  exports: [CardService],
})
export class CardModule {}
