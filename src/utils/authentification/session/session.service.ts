import { Inject, Injectable, Logger } from '@nestjs/common';
import { Session } from './session';
import { RedisClient } from 'src/configuration/redis/redis.provider';

@Injectable()
export class SessionService {
  private logger: Logger = new Logger(SessionService.name);
  constructor(@Inject('Redis_Client') private redisClient: RedisClient) {}

  async createSession(session: Session) {
    try {
      await this.redisClient.set(session.id, JSON.stringify(session));
    } catch (error: any) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  async updateSession(session: Session) {
    try {
      session.updatedAt = new Date();
      await this.redisClient.set(session.id, JSON.stringify(session));
    } catch (error: any) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await this.redisClient.del(sessionId);
    } catch (error: any) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<Session> {
    try {
      const jsonSession: string = await this.redisClient.get(sessionId);
      return JSON.parse(jsonSession) as Session;
    } catch (error: any) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  async hasSession(sessionId: string): Promise<boolean> {
    try {
      return !!(await this.redisClient.exists(sessionId));
    } catch (error: any) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
}
