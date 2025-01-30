import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as IoRedis from 'ioredis';

@Injectable()
export class RedisService {
  redis: IoRedis.Redis;
  private readonly logger = new Logger(RedisService.name);
  constructor(private readonly config: ConfigService) {}

  getRedisInstance = (): IoRedis.Redis => {
    try {
      return (this.redis = new IoRedis.Redis({
        port: this.config.get<number>('redis.port'),
        host: this.config.get<string>('redis.host'),
        username: this.config.get<string>('redis.username'),
        password: this.config.get<string>('redis.password'),
        db: this.config.get<number>('redis.database'),
        retryStrategy: (times: number) => {
          if (times > 5) this.redis.disconnect();
        },
      }));
    } catch (error) {
      this.logger.error('[RedisService]: Fn: constructor: ', error);
    }
  };
}
