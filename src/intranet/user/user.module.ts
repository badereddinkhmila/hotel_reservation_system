import { Module, forwardRef } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';
import { UtilsModule } from 'src/utils/utils.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { UserMapper } from './mapper/user.mapper';

@Module({
  imports: [forwardRef(() => UtilsModule), ConfigurationModule],
  providers: [UserService, UserRepository, RoleRepository, UserMapper],
  exports: [UserService, UserRepository, RoleRepository],
})
export class UserModule {}
