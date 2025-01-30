import { Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

export type RedisClient = Redis;

export const redisProvider = [
  {
    provide: 'Redis_Client',
    inject: [RedisService],
    useFactory: async (redisService: RedisService): Promise<RedisClient> => {
      const logger = new Logger('redisProvider');
      try {
        logger.log('redisProviders: useFactory: ');
        return redisService.getRedisInstance();
      } catch (error) {
        logger.error('Unable to initialize redis: ', error);
      }
    },
  },
];
