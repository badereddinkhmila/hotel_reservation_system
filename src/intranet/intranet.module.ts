import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user/service/user.service';
import { UserModule } from './user/user.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UserRepository } from './user/repository/user.repository';

@Module({
  imports: [forwardRef(() => UtilsModule), UserModule, ConfigurationModule],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class IntranetModule {}
