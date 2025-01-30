import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { UtilsModule } from 'src/utils/utils.module';
import { ServerModule } from 'src/server/server.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configuration/configuration';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ConfigurationModule,
    UtilsModule,
    ServerModule,
  ],
})
export class AppModule {}
