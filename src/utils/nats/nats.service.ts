import { Inject, Injectable, Logger } from '@nestjs/common';
import { JSONCodec, NatsConnection, Payload, PublishOptions } from 'nats';

@Injectable()
export class NatsService {
  private readonly logger: Logger = new Logger(NatsService.name);
  constructor(@Inject('Nats_Client') private natsConnection: NatsConnection) {}

  sendCommand(
    subject: string,
    message: Payload,
    options?: PublishOptions,
  ): void {
    try {
      const jsc = JSONCodec();
      this.natsConnection.publish(subject, jsc.encode(message), options);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
