export interface InmuebleNode {
  Id:number;
  label: string;
  IdInmueble:number;
  IdEdificio:number;
  IdNivel:number;
  IdArea:number;
  children?: InmuebleNode[];
}

export interface InmuebleFlatNode {
  expandable: boolean;
  Id:number,
  label: string;
  IdInmueble:number,
  IdEdificio:number,
  IdNivel:number,
  IdArea:number,
  level: number;
}
