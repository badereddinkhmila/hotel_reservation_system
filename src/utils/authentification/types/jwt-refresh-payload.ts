import { Session } from '../session/session';

export type JwtRefreshPayload = {
  sessionId: Session['id'];
  hash: Session['hash'];
  iss: string;
  iat: number;
  exp: number;
};
