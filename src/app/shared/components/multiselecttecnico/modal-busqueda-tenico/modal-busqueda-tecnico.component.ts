import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
export interface TecnicoElement {
  Id: number;
  Nombre: string;
}
import {MatTableDataSource} from '@angular/material/table';
import {TecnicoService} from "@shared/services/tecnico.service";
const ELEMENT_DATA: TecnicoElement[] = [
  // {Id:1,Nombre: 'segundo mike'},
  // {Id:2,Nombre: 'adriano'},
];
@Component({
  selector: 'app-modal-busqueda-tecnico',
  templateUrl: './modal-busqueda-tecnico.component.html',
  styleUrls: ['./modal-busqueda-tecnico.component.css']
})
export class BusquedaTecnicoComponent implements OnInit {
  IdsClientes:string="";
  IdsProveedor:string="";
  isLoading = false;
  displayedColumns: string[] = ['select', 'Nombre'];
  listDocumentoSeleccionado: any = [];
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<TecnicoElement>(ELEMENT_DATA);
  selection = new SelectionModel<TecnicoElement>(false, []);
  constructor(
    private tecnicoService: TecnicoService,
    public dialogo: MatDialogRef<BusquedaTecnicoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listDocumentoSeleccionado = data.clientChekeado;
    this.IdsClientes=data.IdsCliente.join(",");
    this.IdsProveedor=data.IdsProveedor.join(",");
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
  // /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
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
    /*Marcamos checkedamos los cliente seleccionado*/
    
    this.isLoading = true;
    this.tecnicoService.getTecnicos({
      IdsCliente: this.IdsClientes,
      IdsProveedor: this.IdsProveedor,
      Nombre: nombre
    }).then((res:any) => {
      if(res.TipoResultado==1){
        this.dataSource.data=res.ListaUsuarios;
      }else{
        this.dataSource.data=[];
      }
      this.isLoading = false;
      /*Marcamos checkedamos los cliente seleccionado*/
      let ELEMENT_DATA_SELECCIONADO: TecnicoElement[] = this.dataSource.data.filter(x => {
        return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });
      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  ngOnInit() {
    this.buscarCliente("");
  }
}
