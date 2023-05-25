import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PrintService} from "@modules/materiales/services/print.service";


@Component({
  selector: 'app-print-data',
  templateUrl: './print-data.component.html',
  styleUrls: ['./print-data.component.css']
})
export class PrintDataComponent implements OnInit {
  invoiceIds: any;
  IdUbigeoDestino: number = 0;
  IdUbigeoPartida: number = 0;
 /* DatosDestinatario: string = "SISTEMA EDI";
   Nombre: string = "BRAYAN";
   DomicilioDestino: string = "AV. LA MARINA 123";
   DomicilioPartida: string = "AV.JAVIER PRADO 123";
  // FechaInicioTraslado: string = "";

  // DataListBody: any = []
   dataUbigeoPartida: any = {
     distrito: "SAN BORJA",
     provincia: "LIMA",
     departamento: "LIMA"
   };
   dataUbigeoDestino: any = {
     distrito: "LIMA",
     provincia: "LIMA",
     departamento: "LIMA"
   };

FechaInicioTraslado =[28,12,2022]

   DataListBody:any=[

     {
       Item: "monitor",
       Descripcion: "abv",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xxx  x",
       Observaciones: "NUEVONUEVONUEVONUEVONUEVONUEVONUEVONUEVO"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "778147283",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xxdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into elec",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     },
     {
       Item: "monitor2",
       Descripcion: "abv2",
       Cantidad: "23",
       Unidad:"UND",
       Documento: "xx  xx",
       Observaciones: "NUEVO2"
     }
   ];*/




  DatosDestinatario: string = "";
  Nombre: string = "";
  DomicilioDestino: string = "";
  DomicilioPartida: string = "";
  // FechaInicioTraslado: string = "";
  FechaInicioTraslado: any
  // DataListBody: any = []
  dataUbigeoPartida: any
  dataUbigeoDestino: any

  DataListBody: any = []


  constructor(route: ActivatedRoute,
              private printService: PrintService) {

    this.invoiceIds = route.snapshot.params['invoiceIds']
    let data = JSON.parse(this.invoiceIds)
    this.IdUbigeoDestino = data.IdUbigeoDestino
    this.IdUbigeoPartida = data.IdUbigeoPartida
    this.DatosDestinatario = data.DatosDestinatario
    this.Nombre = data.Nombre
    this.DomicilioDestino = data.DomicilioDestino
    this.DomicilioPartida = data.DomicilioPartida
    // this.FechaInicioTraslado = data.FechaInicioTraslado
    this.FechaInicioTraslado = (new Date(data.FechaInicioTraslado).getUTCDate() + 1) + "/" + (new Date(data.FechaInicioTraslado).getUTCMonth() + 1) + "/" + (new Date(data.FechaInicioTraslado).getUTCFullYear()).toString()
    this.FechaInicioTraslado = this.FechaInicioTraslado.split("/")

    this.DataListBody = data.DataListBody
    this.dataUbigeoPartida = data.dataUbigeoPartida[0]
    this.dataUbigeoDestino = data.dataUbigeoDestino[0]


  }

  ngOnInit() {
    this.printService.onDataReady()
  }


}
