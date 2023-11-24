import { S3 } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  public async upload(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<S3.ManagedUpload.SendData> {
    const { originalname } = file;
    return await this.uploadS3(file.buffer, originalname);
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
}
