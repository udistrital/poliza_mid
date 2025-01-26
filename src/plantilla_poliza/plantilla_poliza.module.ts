import { Module } from '@nestjs/common';
import { PlantillaPolizaService } from './plantilla_poliza.service';
import { PlantillaPolizaController } from './plantilla_poliza.controller';

@Module({
  controllers: [PlantillaPolizaController],
  providers: [PlantillaPolizaService],
})
export class PlantillaPolizaModule {}
