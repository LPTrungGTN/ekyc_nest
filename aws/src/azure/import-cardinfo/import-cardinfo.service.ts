import { Injectable, BadGatewayException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DatabaseService {
  private readonly prisma: PrismaService;
  constructor() {
    this.prisma = new PrismaService();
  }

  // passport
  async savePassportToDb(dataToSave: object): Promise<object> {
    try {
      const dateOfBirth = dataToSave['DateOfBirth'].toISOString().slice(0, 10);
      const dateOfExpiration = dataToSave['DateOfExpiration']
        .toISOString()
        .slice(0, 10);
      const result = await this.prisma.card_informations.create({
        data: {
          type: 'passport',
          id_number:
            dataToSave['DocumentNumber'] && dataToSave['DocumentNumber'],
          full_name:
            dataToSave['LastName'] + dataToSave['FirstName'] &&
            dataToSave['LastName'] + dataToSave['FirstName'],
          birthday: dateOfBirth && dateOfBirth,
          nationality: dataToSave['Nationality'] && dataToSave['Nationality'],
          expire_date: dateOfExpiration && dateOfExpiration,
        },
      });
      console.log('successfully save passport data to db');
      return result;
    } catch (error) {
      throw new BadGatewayException(`Error saving data to database`);
    }
  }
  // Japanese residence card
  async saveResidenceToDb(dataToSave: object): Promise<object> {
    try {
      const fullname = dataToSave['Last Name'] + dataToSave['Firstname'];
      const result = await this.prisma.card_informations.create({
        data: {
          type: 'residence_card',
          id_number: dataToSave['Id number'] && dataToSave['Id number'],
          full_name: fullname && fullname,
          birthday: dataToSave['Date of Birth'] && dataToSave['Date of Birth'],
          address: dataToSave['Address'] && dataToSave['Address'],
          nationality: dataToSave['Nationality'] && dataToSave['Nationality'],
          issue_date: dataToSave['Date issued'] && dataToSave['Date issued'],
          expire_date: dataToSave['Date valid'] && dataToSave['Date valid'],
        },
      });
      console.log('successfully save residence card data to db');
      return result;
    } catch (error) {
      throw new Error(`Error saving data to database: ${error.message}`);
    }
  }

  // Japanese Lisense card
  async saveLisenseToDb(dataToSave: object): Promise<object> {
    try {
      const result = await this.prisma.card_informations.create({
        data: {
          type: 'lisense_card',
          id_number: dataToSave['Id number'] && dataToSave['Id number'],
          full_name: dataToSave['Last Name'] + dataToSave['Firstname'],
          birthday: dataToSave['Date of Birth'] && dataToSave['Date of Birth'],
          address: dataToSave['Address'] && dataToSave['Address'],
          issue_date: dataToSave['Date issued'] && dataToSave['Date issued'],
          expire_date: dataToSave['Date valid'] && dataToSave['Date valid'],
        },
      });
      console.log('successfully save lisense card data to db');
      return result;
    } catch (error) {
      throw new Error(`Error saving data to database: ${error.message}`);
    }
  }

  // Japanese mynumber card
  async saveMynumberToDb(dataToSave: object): Promise<object> {
    try {
      const result = await this.prisma.card_informations.create({
        data: {
          type: 'my_number',
          full_name: dataToSave['Last Name'] + dataToSave['Firstname'],
          birthday: dataToSave['Date of Birth'] && dataToSave['Date of Birth'],
          address: dataToSave['Address'] && dataToSave['Address'],
          expire_date: dataToSave['Date valid'] && dataToSave['Date valid'],
        },
      });
      console.log('successfully save mynumber card data to db');
      return result;
    } catch (error) {
      throw new Error(`Error saving data to database: ${error.message}`);
    }
  }

  // Japanese mynumber card
  async saveVietnamesIdToDb(dataToSave: object): Promise<object> {
    try {
      const full_name = dataToSave['Last_name'] + dataToSave['First_name'];
      const result = await this.prisma.card_informations.create({
        data: {
          type: 'Vietnamese_idcard',
          id_number: dataToSave['Id_number'] && dataToSave['Id_number'],
          full_name: full_name && full_name,
          birthday: dataToSave['Date_of_birth'] && dataToSave['Date_of_birth'],
          address: dataToSave['Address'] && dataToSave['Address'],
          nationality: dataToSave['Nationality'] && dataToSave['Nationality'],
          expire_date: dataToSave['Date_expire'] && dataToSave['Date_expire'],
        },
      });
      console.log('successfully save vietnamese card data to db');
      return result;
    } catch (error) {
      throw new Error(`Error saving data to database: ${error.message}`);
    }
  }
}
