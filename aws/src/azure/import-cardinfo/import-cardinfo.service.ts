import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DatabaseService {
    private readonly prisma: PrismaService;
  constructor() {
    this.prisma =new  PrismaService();
  }

  async saveDataToDatabase(dataToSave: Object): Promise<Object> {
    try {
      const result = await this.prisma.card_informations.create({
        data: {
          id_number: dataToSave['Id number'],
          full_name: dataToSave['Firstname'],
          birthday: dataToSave['Date of Birth'],
        },
      });
      console.log('result', result);
      return result;
    } catch (error) {
      throw new Error(`Error saving data to database: ${error.message}`);
    }
  }
}
