import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  private logger: Logger = new Logger(RefreshTokenGuard.name);
  constructor() {
    super();
  }

  handleRequest(err: Error, session: any) {
    this.logger.debug(session);
    if (err || !session) {
      throw err || new UnauthorizedException();
    }
    return session;
  }
}
