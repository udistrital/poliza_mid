import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plantillas } from './conf';
import { environment } from 'src/environments/environments'
import axios from 'axios';

@Injectable()
export class PlantillaPolizaService {
    constructor(private configService: ConfigService) { }

    async obtenerMinuta(idContrato: number) {
        try {
            // Obtener datos necesarios
            const [contratoCrud, documentoProveedor] = await Promise.all([
                this.obtenerContratoGeneralCrud(idContrato),
                this.obtenerDocumento(idContrato)
            ]);

            if (!contratoCrud) {
                return {
                    Success: false,
                    Status: HttpStatus.NOT_FOUND,
                    Message: `Contrato no encontrado`,
                };
            }

            // Obtener contratista
            const contratista = await this.obtenerContratista(documentoProveedor);

            // Preparar datos iniciales
            const datosIniciales = {
                contratoCrud,
                contratista
            };

            // Obtener plantilla
            const plantilla_id = this.obtenerIdPlantilla(contratoCrud);
            if (!plantilla_id) {
                return {
                    Success: false,
                    Status: HttpStatus.NOT_FOUND,
                    Message: `Plantilla no encontrada`,
                };
            }

            // Renderizar HTML
            const html = await this.renderizarHTML(plantilla_id, datosIniciales);

            // Generar PDF
            const pdf = await this.renderizarPDF({}, html);
            if (!pdf) {
                return {
                    Success: false,
                    Status: HttpStatus.INTERNAL_SERVER_ERROR,
                    Message: `Error al obtener minuta`,
                };
            }

            return {
                Success: true,
                Status: HttpStatus.OK,
                Message: 'Minuta generada exitosamente',
                Data: pdf,
            };
        } catch (error) {
            return {
                Success: false,
                Status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                Message: error.message || 'Error al obtener minuta',
            };
        }
    }

    async obtenerDatosIniciales(data: any) {
        const contrato = data.contratoCrud;
        const contratista = data.contratista;

        return {
            numero_contrato: contrato.id || 'XXXXXXX',
            fecha_suscripcion: contrato.fecha_suscripcion || 'XXXXXXX',
            nombre_contratista: contratista.proveedor.nombre_completo_proveedor || 'XXXXXXX',
            objeto_contrato: contrato.objeto || 'XXXXXXX',
            entidad_aseguradora: 'XXXXXXX',
            numero_poliza: 'XXXXXXX',
            valor_contrato: this.formatearAPesosColombianos(contrato.valor_pesos || 0)
        };
    }

    // Plantilla por unidad ejecutora y tipo de contrato
    obtenerIdPlantilla(contrato: any) {
        const unidadEjecutoraId = contrato.unidad_ejecutora_id;
        const tipoContratoId = contrato.tipo_contrato_id;
        return plantillas?.[unidadEjecutoraId]?.[tipoContratoId];
    }

    // Información de un contrato general por su id (strings)
    async obtenerContratoGeneralCrud(idContrato: number): Promise<any> {
        try {
            const urlGestionContractualCrud: string = this.configService.get<string>(
                'GESTION_CONTRACTUAL_CRUD',
            );

            const url = `${urlGestionContractualCrud}/contratos-generales/${idContrato}`;
            const { data } = await axios.get<any>(url);

            if (!data.Success || data.Status != '200') {
                return null;
            }

            return data.Data;
        } catch (error) {
            return null;
        }
    }

    // Información del contratista (Persona natural) o contratista y representante (Persona juridica)
    async obtenerContratista(documentoContratista: number) {
        try {
            const urlProveedoresMid: string =
                this.configService.get<string>('PROVEEDORES_MID');

            const url = `${urlProveedoresMid}/contratistas?id=${documentoContratista}`;
            const { data } = await axios.get<any>(url);

            if (!data.Success || data.Status != '200') {
                return null;
            }

            return data.Data;
        } catch (error) {
            return null;
        }
    }

    // Número de documento del contratista asociado a un contrato general
    async obtenerDocumento(idContrato: number): Promise<any> {
        try {
            const urlGestionContractualCrud: string = this.configService.get<string>(
                'GESTION_CONTRACTUAL_CRUD',
            );

            const url = `${urlGestionContractualCrud}/contratistas/contrato/${idContrato}`;
            const { data } = await axios.get<any>(url);

            if (!data.Success || data.Status != '200') {
                return null;
            }

            return data.Data?.numero_documento;
        } catch (error) {
            return null;
        }
    }

    // Formatear número a moneda colombiana
    formatearAPesosColombianos(value: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    }

    // Generación de HTML con datos iniciales
    async renderizarHTML(plantilla_id: string, datos: any) {
        try {
            const urlPlantillasMid: string =
                this.configService.get<string>('PLANTILLAS_MID');
            const url = `${urlPlantillasMid}/plantilla/renderizar-html`;
            const { data } = await axios.post<any>(url, { plantilla_id, datos });

            if (!data.Success || data.Status != '200') {
                return null;
            }

            return data.Data;
        } catch (error) {
            return null;
        }
    }

    // Generación de minuta con datos finales
    async renderizarPDF(datos: any, html: string) {
        try {
            const urlPlantillasMid: string =
                this.configService.get<string>('PLANTILLAS_MID');

            const url = `${urlPlantillasMid}/plantilla/renderizar-pdf`;
            const { data } = await axios.post<any>(url, { datos, html });

            if (!data.Success || data.Status != '200') {
                return null;
            }

            return data.Data;
        } catch (error) {
            return null;
        }
    }
}
