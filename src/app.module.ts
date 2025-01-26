import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlantillaPolizaModule } from './plantilla_poliza/plantilla_poliza.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PlantillaPolizaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
