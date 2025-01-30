import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../types/jwt-payload';
import { SessionService } from '../../session/session.service';
import { Session } from '../../session/session';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private logger: Logger = new Logger(JwtStrategy.name);
  constructor(
    configService: ConfigService,
    @Inject() private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtKey', { infer: true }),
    });
  }

  async validate(payload: JwtPayload): Promise<Session> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (!this.sessionService.hasSession(payload.sessionId)) {
      throw new UnauthorizedException();
    }
    const session: Session = await this.sessionService.getSession(
      payload.sessionId,
    );
    session.lastSeen = new Date();
    await this.sessionService.updateSession(session);
    return session;
  }
}
