import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DeleteImageService {

    private imageDirectory = "src/public/image/";

    constructor() { 
    }

    DeleteImageService(fileName: string): boolean {
        const imagePath = path.join(this.imageDirectory, fileName);

        try {
            fs.unlinkSync(imagePath);
            console.log(`image ${fileName} deleted successfully`);
            return true;
        }
        catch (error){
            console.log(`error when deleting image ${fileName}`, error);
            return false;
        }
    }

}
