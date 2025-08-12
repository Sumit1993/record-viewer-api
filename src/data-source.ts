import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Record } from './entities/record.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Record],
  migrations: ['src/migrations/*.ts'],
  ssl: true,
  schema: 'record_viewer',
});
