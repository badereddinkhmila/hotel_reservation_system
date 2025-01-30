import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions, NatsConnection, connect } from 'nats';

@Injectable()
export class NatsService {
  private readonly logger: Logger = new Logger(NatsService.name);
  constructor(private configService: ConfigService) {}

  private getConnectionOptions(): ConnectionOptions {
    return {
      pass: this.configService.get<string>('nats.password'),
      user: this.configService.get<string>('nats.username'),
      servers: this.configService.get<string>('nats.uri'),
      verbose: true,
    };
  }

  async getNatsInstance(): Promise<NatsConnection> {
    try {
      return await connect(this.getConnectionOptions());
    } catch (error) {
      this.logger.error(error);
    }
  }
}
