import { Controller, Get, Res, HttpStatus, Post, UseInterceptors, Req, UploadedFile, Query } from '@nestjs/common';
import { RawDataService } from './raw-data.service';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import moment from 'moment-timezone';

@Controller()
export class RawDataController {
    constructor(private readonly rawDataService: RawDataService) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadRawData(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ) {
        if (!file) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
        }

        if (!(file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv"))) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'File must be csv' });
        }

        await this.rawDataService.uploadRawData(file)

        return res.status(HttpStatus.OK).json({ message: 'File saved successfully' });
    }
    
    @Get('graph')
    async getRawData(
        @Query('startDate') startDateStr: string,
        @Query('endDate') endDateStr: string,
        @Query('enodebId') enodebId: number,
        @Query('cellId') cellId: number,
        @Res() res: Response
    ) {
        let startDate: Date | undefined;
        let endDate: Date | undefined;

        if (startDateStr) startDate = moment.parseZone(startDateStr).toDate();
        if (endDateStr) endDate = moment.parseZone(endDateStr).toDate();

        const result = await this.rawDataService.getRawData({ startDate, endDate, enodebId, cellId })

        return res.status(HttpStatus.OK).json({ 
            message: 'Raw data loaded successfully',
            body: result
        });
    }
}
