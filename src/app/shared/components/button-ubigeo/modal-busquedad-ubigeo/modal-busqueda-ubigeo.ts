import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatChipInputEvent} from '@angular/material/chips';
export interface SolicitanteElement {
  Id: number;
  Pais: string | null;
  Departamento: string | null;
  Provincia: string | null;
  Distrito: string | null;

}
import {MatTableDataSource} from '@angular/material/table';
import {UbigeoService} from "@shared/services/ubigeo.service";
const ELEMENT_DATA: SolicitanteElement[] = [
  // {Id:1,Nombre: 'segundo mike'},
  // {Id:2,Nombre: 'adriano'},
];
@Component({
  selector: 'app-modal-busqueda-solicitante',
  templateUrl: './modal-busqueda-ubigeo.html',
  styleUrls: ['./modal-busqueda-ubigeo.css'],

})
export class ModalBusquedadUbigeoComponent implements OnInit {

  isLoading = false;
  displayedColumns: string[] = ['select', 'Pais',"Departamento","Provincia","Distrito"];
  // listDocumentoSeleccionado: any = [];
  inputData: string="";
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<SolicitanteElement>(ELEMENT_DATA);
  selection = new SelectionModel<SolicitanteElement>(false, []);
  constructor(
    private ubigeoService: UbigeoService,
    public dialogo: MatDialogRef<ModalBusquedadUbigeoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    //this.listDocumentoSeleccionado = data.clientChekeado;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.inputData=filterValue.trim().toLowerCase();
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
    this.buscarCliente(this.inputData);
  }
  buscarCliente(nombre:any): void {

    this.isLoading = true;

    const data ={
      page: 0,
      pageSize: 100,
      offset: 0,
      next: 0,
      filter: {
        dataText:nombre
      }
    }
    this.ubigeoService.getUbigeo(data).then((res: any) => {
  
      this.dataSource.data=res.data;
      this.isLoading = false;
      let ELEMENT_DATA_SELECCIONADO: SolicitanteElement[] = this.dataSource.data.filter(x => {
       
        //return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });

      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  ngOnInit() {
    this.buscarCliente(null);
  }
}
