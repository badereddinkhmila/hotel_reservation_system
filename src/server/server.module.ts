import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthentificationModule } from './http/authentification/authentification.module';
import { UtilsModule } from 'src/utils/utils.module';
import { SearchModule } from './http/search/search.module';

@Module({
  imports: [
    UtilsModule,
    AuthentificationModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthentificationModule,
      },
    ]),
    SearchModule,
  ],
})
export class ServerModule {}
