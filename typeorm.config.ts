import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT') || 5432,
  database: configService.get('DB_DATABASE'),
  username: configService.get('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  synchronize: false,
  migrations: ['src/sql/migrations/*.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
