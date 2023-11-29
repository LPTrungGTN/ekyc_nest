import { S3, Rekognition } from 'aws-sdk';
import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CardService } from '@/card/card.service';
import { ImageService } from '@/image/image.service';

import { Card } from '@prisma/client';

@Injectable()
export class S3Service {
  private s3: S3;
  private rekognition: Rekognition;

  public constructor(
    private configService: ConfigService,
    private readonly cardService: CardService,
    private readonly imageService: ImageService,
  ) {
    this.s3 = new S3({
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
    this.rekognition = new Rekognition();
    this.cardService = cardService;
    this.imageService = imageService;
  }

  public async checkStraightFace(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<Card> {
    try {
      await this.imageService.validateImage(file);
      const { originalname } = file;

      await Promise.all([
        this.imageService.saveImage(file),
        this.uploadS3(file.buffer, originalname),
      ]);

      const response = await this.detectFaces(originalname);

      if (response.FaceDetails.length === 0) {
        throw new BadRequestException('Cannot detect face');
      }
      const face = response.FaceDetails[0];
      const { Roll, Yaw, Pitch } = face.Pose;
      await Promise.all([
        this.checkRoll(Roll),
        this.checkYaw(Yaw),
        this.checkPitch(Pitch),
      ]);

      const cardData = {
        cardType: 'passport',
        straightFace: originalname,
      };
      return this.cardService.create(cardData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async checkSideFace(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<Card> {
    try {
      await this.imageService.validateImage(file);
      const { originalname } = file;

      await Promise.all([
        this.imageService.saveImage(file),
        this.uploadS3(file.buffer, originalname),
      ]);

      const response = await this.detectFaces(originalname);

      if (response.FaceDetails.length === 0) {
        throw new BadRequestException('Cannot detect face');
      }
      const face = response.FaceDetails[0];
      const { Roll, Yaw, Pitch } = face.Pose;
      await Promise.all([
        this.checkRoll(Roll),
        this.checkYaw(Yaw, 35, 55),
        this.checkPitch(Pitch),
      ]);

      const cardData = {
        cardType: 'passport',
        tiltedFace: originalname,
      };
      return this.cardService.create(cardData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private checkRoll(roll: number, threshold: number = 10): void {
    if (Math.abs(roll) >= threshold) {
      throw new BadRequestException('Face is not level horizontally');
    }
  }

  private checkYaw(
    yaw: number,
    lowerThreshold: number = 0,
    upperThreshold: number = 10,
  ): void {
    if (Math.abs(yaw) < lowerThreshold || Math.abs(yaw) > upperThreshold) {
      throw new BadRequestException('Face is not facing forward');
    }
  }

  private checkPitch(pitch: number, threshold: number = 10): void {
    if (Math.abs(pitch) >= threshold) {
      throw new BadRequestException('Face is not level vertically');
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
