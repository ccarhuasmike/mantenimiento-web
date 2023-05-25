import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatChipInputEvent} from '@angular/material/chips';
export interface GrupoUnidadElement {
  Id:number;
  Nombre: string;
  Grupo: string;
  Unidad: string;
}
import {MatTableDataSource} from '@angular/material/table';
import {GrupoUnidadService} from "@shared/services/grupounidad.service";
const ELEMENT_DATA: GrupoUnidadElement[] = [
  // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
];
@Component({
  selector: 'app-modal-busqueda-grupounidad',
  templateUrl: './modal-busqueda-grupounidad.component.html',
  styleUrls: ['./modal-busqueda-grupounidad.component.css']
})
export class BusquedaGrupoUnidadComponent implements OnInit {
  isLoading = false;
  IdsClientes:string="";
  displayedColumns: string[] = ['select', 'Grupo', 'Unidad'];
  listDocumentoSeleccionado: any = [];
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<GrupoUnidadElement>(ELEMENT_DATA);
  selection = new SelectionModel<GrupoUnidadElement>(true, []);
  constructor(
    private clienteService: GrupoUnidadService,
    public dialogo: MatDialogRef<BusquedaGrupoUnidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listDocumentoSeleccionado = data.clientChekeado;
    this.IdsClientes=data.IdsCliente.join(",");
    //this.listDocumentoSeleccionado = data;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }else{
      /*se no se encuentra informacion en el datasource se procedera a buscar en api rest*/
      if(this.dataSource.filteredData.length==0){
      this.buscarCliente(filterValue.trim().toLowerCase());
      }
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {

    this.dialogo.close({
      clienteSeleccionado: this.selection.selected,
      respuesta: true
    });
  }

  
  filtrar():void{
    this.buscarCliente("");
  }
  buscarCliente(nombre:string): void {

    this.isLoading = true;
    this.clienteService.getGrupoUnidadFiltro({
      idcliente: this.IdsClientes,
      nombre: nombre,
    }).then((res:any) => {
      this.dataSource.data=res;
      this.isLoading = false;

      /*Marcamos checkedamos los cliente seleccionado*/
      let ELEMENT_DATA_SELECCIONADO: GrupoUnidadElement[] = this.dataSource.data.filter(x => {
        return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });
      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  eventEmitDoubleClick(event:any){   
    /*Obtenemos registro seleccionados */
    let ELEMENT_DATA_SELECCIONADO: GrupoUnidadElement[] = this.dataSource.data.filter(x => {
      return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
    });
    /* buscamos si el registro a agregar ya esta seleccionado */
    if(!ELEMENT_DATA_SELECCIONADO.some(x=>{return x.Id ===event.Id})){
      ELEMENT_DATA_SELECCIONADO.push(event)
    }
    this.dialogo.close({
      clienteSeleccionado: ELEMENT_DATA_SELECCIONADO,
      respuesta: true
    });
  }

  ngOnInit() {
    this.buscarCliente("");
  }
}
