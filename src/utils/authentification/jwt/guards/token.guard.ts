import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TokenGuard extends AuthGuard('jwt') {
  private logger: Logger = new Logger(TokenGuard.name);
  constructor() {
    super();
  }

  handleRequest(err: Error, session: any) {
    if (err || !session) {
      throw err || new UnauthorizedException();
    }
    return session;
  }
}
