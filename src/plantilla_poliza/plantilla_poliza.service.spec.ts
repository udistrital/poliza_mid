import { Test, TestingModule } from '@nestjs/testing';
import { PlantillaPolizaService } from './plantilla_poliza.service';

describe('PlantillaPolizaService', () => {
  let service: PlantillaPolizaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantillaPolizaService],
    }).compile();

    service = module.get<PlantillaPolizaService>(PlantillaPolizaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
