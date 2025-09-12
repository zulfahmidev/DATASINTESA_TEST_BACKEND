import { Module } from '@nestjs/common';
import { RawDataService } from './raw-data/raw-data.service';
import { RawDataController } from './raw-data/raw-data.controller';
import { RawDataModule } from './raw-data/raw-data.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
    RawDataModule
  ],
})
export class AppModule {}
