import { AuthentificationService } from './authentification/authentification.service';
import { Module, forwardRef } from '@nestjs/common';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { SqlReader } from './sql/sql-reader';
import { IntranetModule } from '../intranet/intranet.module';
import { SessionService } from './authentification/session/session.service';
import { JwtStrategy } from './authentification/jwt/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TokenGuard } from './authentification/jwt/guards/token.guard';
import { JwtRefreshStrategy } from './authentification/jwt/strategies/jwt-refresh.strategy';
import { RefreshTokenGuard } from './authentification/jwt/guards/refresh-token.guard';
import { MailerService } from './mailer/mailer.service';
import { TemplateService } from './mailer/template.service';
import { NatsService } from './nats/nats.service';
import { AuthGoogleService } from './authentification/google/authGoogle.service';

@Module({
  imports: [
    ConfigModule,
    ConfigurationModule,
    forwardRef(() => IntranetModule),
    JwtModule.register({}),
    PassportModule,
  ],
  providers: [
    EncryptionService,
    SqlReader,
    SessionService,
    AuthentificationService,
    AuthGoogleService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenGuard,
    RefreshTokenGuard,
    MailerService,
    TemplateService,
    NatsService,
  ],
  exports: [
    EncryptionService,
    SqlReader,
    AuthentificationService,
    AuthGoogleService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenGuard,
    RefreshTokenGuard,
    MailerService,
    NatsService,
  ],
})
export class UtilsModule {}
