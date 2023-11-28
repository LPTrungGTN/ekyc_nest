import { S3, Rekognition } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CardService } from '@/card/card.service';
import { Card } from '@prisma/client';

@Injectable()
export class S3Service {
  private s3: S3;
  private rekognition: Rekognition;

  public constructor(
    private configService: ConfigService,
    private cardService: CardService,
  ) {
    this.s3 = new S3({
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
    this.rekognition = new Rekognition();
    this.cardService = cardService;
  }

  public async upload(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<Card> {
    try {
      const { originalname } = file;
      await this.uploadS3(file.buffer, originalname);
      this.detectFaces(originalname);
      const cardData = {
        cardType: 'passport',
        straightFace: originalname,
      };
      return this.cardService.create(cardData);
    } catch (error) {
      return error;
    }
  }

  private async uploadS3(
    file: Buffer,
    name: string,
  ): Promise<S3.ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: name,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  private async detectFaces(
    fileName: string,
  ): Promise<Rekognition.DetectFacesResponse> {
    const params: Rekognition.DetectFacesRequest = {
      Image: {
        S3Object: {
          Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
          Name: fileName,
        },
      },
      Attributes: ['ALL'],
    };

    return new Promise((resolve, reject) => {
      this.rekognition.detectFaces(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}
