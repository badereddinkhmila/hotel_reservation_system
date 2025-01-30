import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { hash as argon2Hash, verify as argon2Verify } from 'argon2';

@Injectable()
export class EncryptionService {
  private cipherIv: any = undefined;
  private decipherIv: any = undefined;
  private key: Promise<Buffer> = undefined;
  private iv: Buffer = undefined;
  private readonly encoding: BufferEncoding = 'hex';
  private readonly logger: Logger = new Logger(EncryptionService.name);

  constructor(private readonly config: ConfigService) {
    try {
      this.iv = Buffer.from(
        this.config.get<string>('encryption.scryptIv'),
        this.encoding,
      );
      this.key = promisify(scrypt)(
        this.config.get('encryption.scryptKey'),
        this.config.get('encryption.scryptKey'),
        32,
      ) as Promise<Buffer>;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private loadCipher = async (): Promise<void> => {
    try {
      const key = await this.key;
      this.cipherIv = createCipheriv('aes-256-ctr', key, this.iv);
    } catch (error) {
      this.logger.error('[EncryptionService]: Fn: loadCipher: ', error);
    }
  };

  private loadDecifer = async (): Promise<void> => {
    try {
      const key = await this.key;
      this.decipherIv = createDecipheriv('aes-256-ctr', key, this.iv);
    } catch (error) {
      this.logger.error('[EncryptionService]: Fn: loadDecifer: ', error);
    }
  };

  encryptValue = async (value: string): Promise<string> => {
    try {
      const key = await this.key;
      const cipherIv = createCipheriv('aes-256-ctr', key, this.iv);
      return Buffer.concat([
        cipherIv.update(value, 'utf-8'),
        cipherIv.final(),
      ]).toString(this.encoding);
    } catch (error) {
      this.logger.error('[EncryptionService]: Fn: encryptValue: ', error);
    }
  };

  decryptValue = async (cipherValue: string): Promise<string> => {
    try {
      const key = await this.key;
      const decipherIv = createDecipheriv('aes-256-ctr', key, this.iv);
      return Buffer.concat([
        decipherIv.update(Buffer.from(cipherValue, this.encoding)),
        decipherIv.final(),
      ]).toString();
    } catch (error) {
      this.logger.error('[EncryptionService]: Fn: decryptValue: ', error);
    }
  };

  hashPassowrd = async (password: string): Promise<string> => {
    try {
      return await argon2Hash(password, {
        secret: await this.key,
      });
    } catch (error) {
      this.logger.error('[EncryptionService]: Fn: hashPassowrd: ', error);
    }
  };

  verifyPassowrd = async (password: string, hash: string): Promise<boolean> => {
    try {
      return await argon2Verify(hash, password, { secret: await this.key });
    } catch (error) {
      this.logger.error('[EncryptionService]: Fn: verifyPassowrd: ', error);
    }
  };
}
