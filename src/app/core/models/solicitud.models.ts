export interface SolicitarAprobacionPresupuesto {
  IdElaborador?: number;
  MontoTotal?: number;
  IdMoneda?: string;
  IdProveedorRecomendado?: number;
  Indicaciones?: string;
}

export interface SolicitudEnviarProveeedor {
  IdProveedorSolicitud?: number;
  MontoConsiliadoSolicitud?: number;
  PlazoEstimadoTerminoSolicitud?: number;
}

export interface SolicitudReporteTecnico{
  IdTecnico?: number;
  IdTipoAveria?: string;
  IdTipoSolucion?: string;
  DescripcionDetallada?: string;
}




