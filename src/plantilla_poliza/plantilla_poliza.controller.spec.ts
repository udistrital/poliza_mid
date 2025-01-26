import { Test, TestingModule } from '@nestjs/testing';
import { PlantillaPolizaController } from './plantilla_poliza.controller';
import { PlantillaPolizaService } from './plantilla_poliza.service';

describe('PlantillaPolizaController', () => {
  let controller: PlantillaPolizaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantillaPolizaController],
      providers: [PlantillaPolizaService],
    }).compile();

    controller = module.get<PlantillaPolizaController>(PlantillaPolizaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
