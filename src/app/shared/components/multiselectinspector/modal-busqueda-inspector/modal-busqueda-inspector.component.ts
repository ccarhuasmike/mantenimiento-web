import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatChipInputEvent} from '@angular/material/chips';
export interface InspectorElement {
  Id:number,
  Nombre: string;

}
import {MatTableDataSource} from '@angular/material/table';
import {InspectorService} from "@shared/services/inspector.service";
const ELEMENT_DATA: InspectorElement[] = [
  // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  // {Nombre: 'segundo lu', NombreCorto: 'lucho', NumeroDocumento: '7011158'},
  // {Nombre: 'segundo da', NombreCorto: 'manuel', NumeroDocumento: '70116582'},
  // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  // {Nombre: 'segundo lu', NombreCorto: 'lucho', NumeroDocumento: '7011158'},
  // {Nombre: 'segundo da', NombreCorto: 'manuel', NumeroDocumento: '70116582'},
  // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  // {Nombre: 'segundo lu', NombreCorto: 'lucho', NumeroDocumento: '7011158'},
  // {Nombre: 'segundo da', NombreCorto: 'manuel', NumeroDocumento: '70116582'},
  // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  // {Nombre: 'segundo lu', NombreCorto: 'lucho', NumeroDocumento: '7011158'},
  // {Nombre: 'segundo da', NombreCorto: 'manuel', NumeroDocumento: '70116582'},
];
@Component({
  selector: 'app-modal-busqueda-inspector',
  templateUrl: './modal-busqueda-inspector.component.html',
  styleUrls: ['./modal-busqueda-inspector.component.css']
})
export class BusquedaInspectorComponent implements OnInit {
  IdsClientes:string="";
  isLoading = false;
  displayedColumns: string[] = ['select', 'Nombre'];
  listDocumentoSeleccionado: any = [];
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<InspectorElement>(ELEMENT_DATA);
  selection = new SelectionModel<InspectorElement>(true, []);
  constructor(
    private clienteService: InspectorService,
    public dialogo: MatDialogRef<BusquedaInspectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listDocumentoSeleccionado = data.clientChekeado;
    this.IdsClientes=data.IdsCliente.join(",");
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
  eventEmitDoubleClick(event:any){   
    /*Obtenemos registro seleccionados */
    let ELEMENT_DATA_SELECCIONADO: InspectorElement[] = this.dataSource.data.filter(x => {
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

  buscarCliente(nombre:string): void {
    
    this.isLoading = true;
    this.clienteService.getInspectorFiltro({
      idcliente: this.IdsClientes,
      nombre: nombre//"ABDON VELASQUEZ VAQUERIZO"
    }).then((res:any) => {
      this.dataSource.data=res;
      this.isLoading = false;
      /*Marcamos checkedamos los cliente seleccionado*/
      let ELEMENT_DATA_SELECCIONADO: InspectorElement[] = this.dataSource.data.filter(x => {
        return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });
      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  ngOnInit() {
    this.buscarCliente("");
  }
}
