import { SessionService } from './session/session.service';
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../intranet/user/service/user.service';
import { ConfigService } from '@nestjs/config';
import { UserSigninDTO } from '../../intranet/user/dto/user-signin.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { Session } from './session/session';
import { LoginResponseDto } from './dto/login-response.dto';
import * as crypto from 'crypto';
import { EmailConfirmation } from './types/email-confirmation';
import { MailerService } from '../mailer/mailer.service';
import { UserReadDTO } from 'src/intranet/user/dto/user-read.dto';
import { NatsService } from 'src/utils/nats/nats.service';

@Injectable()
export class AuthentificationService {
  private readonly logger = new Logger(AuthentificationService.name);
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
    private sessionService: SessionService,
    private mailerService: MailerService,
    @Inject() private natsService: NatsService,
  ) {}

  registerUser = async ({
    firstname,
    lastname,
    email,
    externalId,
  }: UserReadDTO) => {
    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: externalId,
      },
      {
        secret: this.configService.getOrThrow<string>('auth.confirmKey'),
        expiresIn: this.configService.getOrThrow<string>('auth.confirmExpiry'),
      },
    );
    const url = `http://${this.configService.get<string>('app.host')}:${this.configService.get<string>('app.port')}/api/v1/auth/confirm_email?hash=${hash}`;
    this.natsService.sendCommand(
      'confirmation_email',
      JSON.stringify({
        hash: url,
        firstname,
        lastname,
        email,
        companyname: this.configService.get<string>('company.name'),
        contactemail: this.configService.get<string>('company.email'),
      }),
    );
  };

  confirmUserEmail = async (hash: string) => {
    let userId: string;
    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: string;
      }>(hash, {
        secret: this.configService.getOrThrow<string>('auth.confirmKey'),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.getById(userId);

    if (!user || !user?.isActive) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.isVerified = true;

    await this.usersService.updateById(user.externalId, user);
  };

  async validateLogin(loginDto: UserSigninDTO): Promise<LoginResponseDto> {
    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    // if (user.provider !== AuthProvidersEnum.email) {
    //   throw new UnprocessableEntityException({
    //     status: HttpStatus.UNPROCESSABLE_ENTITY,
    //     errors: {
    //       email: `needLoginViaProvider:${user.provider}`,
    //     },
    //   });
    // }
    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await this.encryptionService.verifyPassowrd(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(crypto.randomBytes(32).toString('hex'))
      .digest('hex');

    const session = {
      id: await this.encryptionService.encryptValue(user.internalId),
      user: user,
      roles: user.roles,
      views: ['All'],
      hash,
      permissions: ['All'],
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Session;

    await this.sessionService.createSession(session);

    const { token: accessToken, refreshToken } = await this.getTokensData({
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  async refreshToken(currentSession: Session): Promise<LoginResponseDto> {
    const hash = crypto
      .createHash('sha256')
      .update(crypto.randomBytes(32).toString('hex'))
      .digest('hex');

    currentSession.hash = hash;

    await this.sessionService.updateSession(currentSession);
    const { token: accessToken, refreshToken } = await this.getTokensData({
      sessionId: currentSession.id,
      hash,
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  private async getTokensData(data: { sessionId: string; hash: string }) {
    const tokenExpiresIn = this.configService.getOrThrow<number>(
      'auth.jwtExpiry',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + tokenExpiresIn;

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.jwtKey', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshKey', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow<number>(
            'auth.refreshExpiry',
            {
              infer: true,
            },
          ),
        },
      ),
    ]);

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async sendEmailConfirmation(payload: {
    hash: string;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
    contactemail: string;
  }) {
    const emailTemplate = new EmailConfirmation({
      firstname: payload.firstname,
      lastname: payload.lastname,
      companyname: payload.companyname,
      contactemail: payload.contactemail,
      hash: payload.hash,
    });

    return await this.mailerService.sendEmailFromTemplate(emailTemplate, {
      to: [payload.email],
    });
  }
}
