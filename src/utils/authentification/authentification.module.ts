import { Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { AuthGoogleService } from './google/authGoogle.service';

@Module({
  imports: [],
  providers: [AuthentificationService, AuthGoogleService],
  exports: [AuthentificationService, AuthGoogleService],
})
export class AuthentificationModule {}
