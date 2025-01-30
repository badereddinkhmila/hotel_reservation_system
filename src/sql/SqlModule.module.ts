import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, UtilsModule],
  providers: [],
  exports: [],
})
export class UtilsModule {}
