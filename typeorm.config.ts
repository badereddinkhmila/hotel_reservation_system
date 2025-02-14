import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.get('DB_PORT') || 5432,
  database: configService.getOrThrow('DB_DATABASE'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  synchronize: false,
  migrations: ['src/sql/migrations/*.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
