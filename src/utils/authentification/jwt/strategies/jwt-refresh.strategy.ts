import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../../session/session.service';
import { Session } from '../../session/session';
import { JwtRefreshPayload } from '../../types/jwt-refresh-payload';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private logger: Logger = new Logger(JwtRefreshStrategy.name);
  constructor(
    configService: ConfigService,
    @Inject() private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.refreshKey', { infer: true }),
    });
  }

  async validate(payload: JwtRefreshPayload): Promise<Session> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (!this.sessionService.hasSession(payload.sessionId)) {
      throw new UnauthorizedException();
    }

    const session: Session = await this.sessionService.getSession(
      payload.sessionId,
    );

    if (session.hash != payload.hash) {
      throw new UnauthorizedException();
    }

    session.lastSeen = new Date();
    await this.sessionService.updateSession(session);

    return session;
  }
}
