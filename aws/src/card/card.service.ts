import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Card, Prisma } from '@prisma/client';

@Injectable()
export class CardService {
  public constructor(private prisma: PrismaService) {
    this.prisma = prisma;
  }

  public async create(data: Prisma.CardCreateInput): Promise<Card> {
    return this.prisma.card.create({ data });
  }
}
