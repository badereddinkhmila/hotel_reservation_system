import { Session } from '../session/session';

export type JwtPayload = {
  sessionId: Session['id'];
  iss: string;
  iat: number;
  exp: number;
};
