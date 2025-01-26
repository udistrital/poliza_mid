import { Controller } from '@nestjs/common';
import { PlantillaPolizaService } from './plantilla_poliza.service';

@Controller('plantilla-poliza')
export class PlantillaPolizaController {
  constructor(private readonly plantillaPolizaService: PlantillaPolizaService) {}
}
