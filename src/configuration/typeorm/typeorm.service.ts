import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeormService {
  private readonly logger = new Logger(TypeormService.name);
  constructor(private readonly config: ConfigService) {}

  getTypeOrmModuleOptions = (): TypeOrmModuleOptions => {
    const dbOptions = {
      synchronize: false,
      autoLoadEntities: true,
      entities: [join(__dirname, '../../intranet/**/*.entity.{js,ts}')],
    };

    Object.assign(dbOptions, {
      type: this.config.get('postgres.provider'),
      host: this.config.get('postgres.host'),
      port: parseInt(this.config.get('postgres.port')) || 5432,
      database: this.config.get('postgres.database'),
      username: this.config.get('postgres.username'),
      password: this.config.get('postgres.password'),
      logging: true,
    });

    switch (this.config.get('app.mode') ?? 'DEV') {
      case 'DEV':
        Object.assign(dbOptions, {
          type: this.config.get('postgres.provider'),
          host: this.config.get('postgres.host'),
          port: parseInt(this.config.get('postgres.port')) || 5432,
          database: this.config.get('postgres.database'),
          username: this.config.get('postgres.username'),
          password: this.config.get('postgres.password'),
        });
        break;

      case 'TEST':
        Object.assign(dbOptions, {
          type: 'sqlite',
          database: 'test.sqlite',
        });
        break;

      case 'PROD':
        Object.assign(dbOptions, {
          type: this.config.get('postgres.provider'),
          host: this.config.get('postgres.host'),
          port: this.config.get<number>('postgres.port') || 5432,
          database: this.config.get('postgres.database'),
          username: this.config.get('postgres.username'),
          password: this.config.get('postgres.password'),
        });
        break;

      default:
        throw new Error('unknown environment');
    }

    return dbOptions;
  };

  getDataSourceOptions = (): DataSourceOptions => {
    const options: DataSourceOptions = {
      ...this.getTypeOrmModuleOptions(),
    } as DataSourceOptions;

    Object.assign(options, {
      migrationsTableName: '__migrations',
      migrations: [join(__dirname, '../../sql/migrations/*.ts')],
      dropSchema: false,
      keepConnectionAlive: false,
      extra: {
        max: 1000,
      },
      cli: {
        entitiesDir: join(__dirname, '../../intranet'),
        migrationsDir: join(__dirname, '../../sql/migrations'),
      },
    } as Partial<DataSourceOptions>);

    return options;
  };

  /**
   * @returns Promise<DataSource> typeorm database connection
   */
  getDataSouceInstance = async (): Promise<DataSource> => {
    const dataSource = new DataSource(this.getDataSourceOptions());
    try {
      return await dataSource.initialize();
    } catch (error) {
      this.logger.error('[TypeormService]: Fn: getDataSouceInstance: ', error);
    }
    // finally {
    //   this.logger.warn(
    //     'Finally: destroying datasource: ' + dataSource.isInitialized,
    //   );
    //   await dataSource.destroy();
    // }
  };
}
