import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { InjectModel } from '@nestjs/mongoose';
import { RawData, RawDataDocument } from './raw-data.schema';
import { Model } from 'mongoose';

@Injectable()
export class RawDataService {
    constructor(
        @InjectModel(RawData.name) private rawDataModel: Model<RawDataDocument>,
    ) {}

    async uploadRawData(file: Express.Multer.File) {
        let results: any[] = [];

        const stream = Readable.from(file.buffer.toString());

        await new Promise<void>((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
        });

        
        const seen = new Set()
        results = results
        .filter((v) => {
            return v["Result Time"] != ""
        })
        .map((v, i) => {
            const objectName = parseLine(v["Object Name"])
            return {
                resultTime: v["Result Time"],
                enodebId: objectName["eNodeB ID"],
                cellId: objectName["Local Cell ID"],
                availDur: v["L.Cell.Avail.Dur"]
            }
        })
        .filter((v) => {
            const key = `${v.enodebId}_${v.cellId}_${v.resultTime}`
            
            if (seen.has(key)) {
                return false
            }

            seen.add(key)
            return true
        }) as RawData[]

        try {
            await this.rawDataModel.insertMany(results, { ordered: false })
        } catch { return }
    }

    async getRawData({ startDate, endDate, enodebId, cellId }) {
        const query: any = {};

        query.resultTime = {};
        if (startDate) query.resultTime.$gte = startDate;
        if (endDate) query.resultTime.$lte = endDate;
        if (enodebId) query.enodebId = enodebId;
        if (cellId) query.cellId = cellId;


        const result = await this.rawDataModel
        .find(query)
        .sort({ resultTime: -1 })
        .exec()

        const data = result.map((v) => {
            const availability = (v.availDur / 900) * 100

            return {
                resultTime: v.resultTime,
                availability: availability
            }
        })

        return data
    }

}

function parseLine(line) {
  const startIdx = line.indexOf("=");
  if (startIdx === -1) return {};
  const tail = line.slice(line.indexOf(" ", line.indexOf("=")) - 50) || line;
  return Object.fromEntries(
    line
      .split(',')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => {
        const i = p.indexOf('=');
        if (i === -1) return [p, null];
        const k = p.slice(0, i).trim();
        const v = p.slice(i + 1).trim();
        return [k, v];
      })
  );
}
