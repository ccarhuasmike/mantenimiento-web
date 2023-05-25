import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MaterialesService } from '../../services/materiales.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/auth/auth.service";
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  eEstadoSolicitud
} from "@core/types/formatos.types";
import { ClienteService } from '@shared/services/cliente.service';
import { ThisReceiver } from '@angular/compiler';
export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-bandeja-almacenes',
  templateUrl: './bandeja-almacenes.component.html',
  styleUrls: ['./bandeja-almacenes.component.css']
})
export class BandejaAlmacenesComponent implements OnInit, OnDestroy {
  eEstadoSolicitud = eEstadoSolicitud;
  fechaHoy = new Date();
  matexpansionpanelfiltro: boolean = false;
  isLoading = false;
  public itemsPerPagess: string = 'smensaje';
  public itemsPerPage: number = 10;
  public totalRegistros: number = 0;
  public currentPage: number = 0;
  listClienteSeteado: any = [];
  listSolicitanteSeteado: any = [];
  public dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;

  _filtroLocalStoreage: any = {};
  _filtro: any = {
    IdsCliente: [],
    CodigoEstablecimiento: null,
    Almacen: null,
    Estado:"Activo",


 
  };
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  datosEdi: any = {};
  displayedColumns: string[] =
    [
      'Codigo',
      'Almacen',
      'CodigoEstablecimiento',
      'Ubigeo',
      'Estado',
    
    ];

  constructor(
    private _router: Router,
    public dialogo: MatDialog,
    private _authService: AuthService,
    private route: ActivatedRoute,
    public clienteService:ClienteService,
    private solicitudesService: MaterialesService,
    private datePipe: DatePipe,
  ) {
  }



  recibiRespuestaCliente(event: any): void {
    this._filtroLocalStoreage.ClienteDefault = event;
    this._filtro.IdsCliente = event.map((x: any) => { return x.Id });
  }
 


  LimpiarControles() {
    this._filtro.IdsCliente = [];
    this._filtro.CodigoEstablecimiento =null;
    this._filtro.Almacen = null;
    this._filtro.Estado = "Activo";

    // this.listClienteSeteado.push({
    //   Id: this.datosEdi.IdCliente,
    //   Nombre: 'BANCO FALABELLA',
    //   NombreCorto: 'BANCO FALABELLA',
    //   NumeroDocumento: ''
    // });
    // this.listSolicitanteSeteado.push({
    //   Id: this.datosEdi.Id,
    //   Nombre: this.datosEdi.Nombre +" " +this.datosEdi.ApellidoPaterno + " "+this.datosEdi.ApellidoMaterno
    // });
  }
  toRegister(): void {
    this._router.navigate(['materiales/registro'], { relativeTo: this.route });
  }
  //#region Deserializer get encriptado
  fromBinary(binary: string) {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const charCodes = new Uint16Array(bytes.buffer);
    let result = '';
    for (let i = 0; i < charCodes.length; i++) {
      result += String.fromCharCode(charCodes[i]);
    }
    return result;
  }
  loadDatos(): void {
    var request = {
      page: 0,
      pageSize: 10,
      filter: {
        IdClientes: this._filtro.IdsCliente,
      CodigoEstablecimiento: this._filtro.CodigoEstablecimiento,
      Almacen: this._filtro.Almacen,
      Estado: this._filtro.Estado,
   },
     // Codigo: this._filtro.Codigo.trim(),
      SortExpression: "",
      SortDirection: "",
    }
    this.isLoading = true;//for efect loading
    this.dataSource = [];
    this.matexpansionpanelfiltro = false;

    this.solicitudesService.FiltroAlmacenes(request).then((res) => {
      this.isLoading = false;
      this.dataSource = res.data;
      this.totalRegistros = res.totalRecords;
      
      /*
    
      this.isLoading = false;
      var respuesta = JSON.parse(res);
      this.dataSource = respuesta.respuesta;
      this.totalRegistros = respuesta.total;
    */});
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadDatos();
  };
  //#endregion

  ngOnDestroy(): void {
    localStorage.setItem('_filtroLocalStoreageSolicitudes', JSON.stringify(this._filtroLocalStoreage));    
  }
  
  ngOnInit(): void {
    
    //localStorage.removeItem("_filtroLocalStoreageSolicitudes");
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    
    if (localStorage.getItem("_filtroLocalStoreageSolicitudes") !== null && localStorage.getItem("_filtroLocalStoreageSolicitudes") !== '{}') {
      this._filtroLocalStoreage = JSON.parse(localStorage.getItem("_filtroLocalStoreageSolicitudes")!);
      this._filtroLocalStoreage.ClienteDefault.forEach((element: any) => {
        this.listClienteSeteado.push({
          Id: element.Id,
          Nombre: element.Nombre,
          NombreCorto: element.NombreCorto,
          NumeroDocumento: ''
        });
      });

    } else {
      this.listClienteSeteado.push({
        Id: this.datosEdi.ClienteDefault.Id,
        Nombre: this.datosEdi.ClienteDefault.Nombre,
        NombreCorto: this.datosEdi.ClienteDefault.NombreCorto,
        NumeroDocumento: ''
      });
    }

    /*
    this.listClienteSeteado.push({
      Id: this.datosEdi.ClienteDefault.Id,
      Nombre: this.datosEdi.ClienteDefault.Nombre,
      NombreCorto: this.datosEdi.ClienteDefault.NombreCorto,
      NumeroDocumento: ''
    });*/

    this._filtro.IdsCliente = this.listClienteSeteado.map((x: any) => { return x.Id });



    this.listSolicitanteSeteado.push({
      Id: this.datosEdi.Id,
      Nombre: this.datosEdi.Nombre + " " + this.datosEdi.ApellidoPaterno + " " + this.datosEdi.ApellidoMaterno
    });

    this.loadDatos();
  }
  EditarSolicitud(data: number) {
/*
    this._router.navigate(['/solicitud/editarsolicitud'], { queryParams: { id: data } });
    //this._router.navigate(['/products']);*/
  }

}
