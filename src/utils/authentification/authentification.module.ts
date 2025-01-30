import { Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';

@Module({
  imports: [],
  providers: [AuthentificationService],
  exports: [AuthentificationService],
})
export class AuthentificationModule {}
