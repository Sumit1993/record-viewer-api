import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RecordsService } from './records/records.service';
import { RecordsController } from './records/records.controller';
import { Record } from './entities/record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Use environment variable for security
      entities: [Record],
      synchronize: false, // Use migrations, not auto-sync
      ssl: true, // Enable SSL if required by your database
      schema: 'record_viewer',
    }),
    TypeOrmModule.forFeature([Record]), // Register the Record entity
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class AppModule {}
