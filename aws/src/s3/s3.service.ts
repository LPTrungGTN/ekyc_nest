import { S3 } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  async upload(file) {
    const { originalname } = file;
    return await this.uploadS3(file.buffer, originalname);
  }

  async uploadS3(file, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }
}
