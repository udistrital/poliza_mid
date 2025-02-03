import {
  Controller,
  Get,
  Param,
  HttpStatus,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { AmparosContratosService } from './amparos-contratos.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('amparos-contratos')
@Controller('amparos-contratos')
export class AmparosContratosController {
  constructor(
    private readonly amparosContratosService: AmparosContratosService,
  ) {}

  @Get(':contratoId')
  @ApiOperation({ summary: 'Obtener amparos por ID de contrato' })
  @ApiParam({
    name: 'contratoId',
    type: 'number',
    description: 'ID del contrato',
  })
  @ApiResponse({
    status: 200,
    description: 'Amparos encontrados con éxito',
  })
  @ApiResponse({ status: 404, description: 'Amparos no encontrados' })
  async getAmparosByContratoId(
    @Res() res: Response,
    @Param('contratoId') contratoId: string,
  ): Promise<void> {
    try {
      const result =
        await this.amparosContratosService.getAmparosByContratoId(+contratoId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({
          Success: false,
          Status: HttpStatus.NOT_FOUND,
          Message: error.message,
          Data: null,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        Success: false,
        Status: HttpStatus.INTERNAL_SERVER_ERROR,
        Message: 'Error al consultar los amparos',
        Data: error.message,
      });
    }
  }
}
