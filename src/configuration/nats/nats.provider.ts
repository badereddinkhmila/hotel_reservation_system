import { Logger } from '@nestjs/common';
import { NatsService } from './nats.service';
import { NatsConnection } from 'nats';

export const natsProvider = [
  {
    provide: 'Nats_Client',
    inject: [NatsService],
    useFactory: async (natsService: NatsService): Promise<NatsConnection> => {
      const logger = new Logger('natsProvider');
      try {
        logger.log('natsProviders: useFactory: ');
        return await natsService.getNatsInstance();
      } catch (error) {
        logger.error('Unable to initialize nats: ', error);
      }
    },
  },
];
