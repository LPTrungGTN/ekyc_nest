import {
  Controller,
  Get,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

import { AzureService } from './azure.service';

@Controller('process')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}

  @Get()
  async processImage(
    @Body('type') type: number,
    @Body('imageName') imageName: string,
    @Res() res: Response, 
  ): Promise<void> {
    if (!imageName || type === undefined) {
      throw new BadRequestException(
        'Bothsda "imageName" and "type" are required.',
      );
    }
    try {
      const result = await this.azureService.processImage(imageName, type);
      res.send({ result });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

// src / public / image / image.jpg;
    // const imagePath = 'src/public/image/image.jpg';

