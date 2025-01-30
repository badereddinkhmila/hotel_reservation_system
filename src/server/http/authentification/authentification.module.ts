import { Module, forwardRef } from '@nestjs/common';
import { AuthentificationController } from './authentification.controller';
import { IntranetModule } from 'src/intranet/intranet.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [IntranetModule, forwardRef(() => UtilsModule)],
  controllers: [AuthentificationController],
})
export class AuthentificationModule {}
