import { mailerProvider } from './mailer/mailer.provider';
import { Module } from '@nestjs/common';
import { RequestContextService } from './request-context/request-context.service';
import { postgreSQLProvider } from './typeorm/typeorm.provider';
import { redisProvider } from './redis/redis.provider';
import { ConfigModule } from '@nestjs/config';
import { TypeormService } from './typeorm/typeorm.service';
import { RedisService } from './redis/redis.service';
import { MailerService } from './mailer/mailer.service';
import { NatsService } from './nats/nats.service';
import { natsProvider } from './nats/nats.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    ...redisProvider,
    ...postgreSQLProvider,
    ...mailerProvider,
    ...natsProvider,
    TypeormService,
    RequestContextService,
    RedisService,
    MailerService,
    NatsService,
  ],
  exports: [
    RequestContextService,
    ...postgreSQLProvider,
    ...redisProvider,
    ...mailerProvider,
    ...natsProvider,
  ],
})
export class ConfigurationModule {}
