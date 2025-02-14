import { Injectable, Logger } from '@nestjs/common';
import SocialInterface from '../types/social-interface';
import axios from 'axios';

@Injectable()
export class AuthGoogleService {
  private readonly logger: Logger = new Logger(AuthGoogleService.name);

  async getUserProfile(googleAccessToken: string): Promise<SocialInterface> {
    try {
      const { data: userInfo } = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        },
      );
      return {
        id: userInfo.sub,
        firstname: userInfo.given_name,
        lastname: userInfo.family_name,
        email: userInfo.email,
        isVerified: userInfo.email_verified,
        picture: userInfo.picture,
      } as SocialInterface;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
