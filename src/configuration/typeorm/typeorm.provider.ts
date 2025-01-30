import { DataSource } from 'typeorm';
import { TypeormService } from './typeorm.service';
import { Logger } from '@nestjs/common';

export const postgreSQLProvider = [
  {
    provide: DataSource,
    inject: [TypeormService],
    useFactory: async (typeormService: TypeormService) => {
      const logger = new Logger('postgreSQLProvider');
      try {
        const datasource = await typeormService.getDataSouceInstance();
        return datasource;
      } catch (error) {
        logger.error('Unable to initialize database: ', error);
      }
    },
  },
];
