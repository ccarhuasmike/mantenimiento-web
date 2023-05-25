export interface GrupoMantenimientoNode {
  Id:number;
  label: string;
  nivel:number;
  IdGrupoMantenimiento:number;
  IdUnidadMantenimiento:number;
  IdClasificacionProblema:number;
  children?: GrupoMantenimientoNode[];
}

export interface GrupoMantenimientoFlatNode {
  expandable: boolean;
  level: number;
  Id:number;
  label: string;
  nivel:number;
  IdGrupoMantenimiento:number;
  IdUnidadMantenimiento:number;
  IdClasificacionProblema:number;

}
