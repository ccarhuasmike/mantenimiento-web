import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,FormBuilder } from '@angular/forms';
import { SalaReunionService } from '@modules/espacios/services/salareunion.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-bandeja-sala-reunion-page',
  templateUrl: './bandeja-sala-reunion-page.component.html',
  styleUrls: ['./bandeja-sala-reunion-page.component.css']
})
export class BandejaSalaReunionPageComponent implements OnInit {
  isLoading = false;  
  titulo:string=" BANDEJA DE SALA DE REUNIONES";
  nombreBotonNuevo:string="CREAR SALA";  
  columnas = ['Nombre','Inmueble','Piso','aforo','tieneFriobar','tieneTv','tieneVideoConferencia','fechaRegistro'];
  listarDto: any = null;
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private objService: SalaReunionService,
  ) { 

  }
  inicializaControles(){    
    this.formulario = this.fb.group({
      nombre: ""
    });
  }

  ngOnInit(): void {
    this.inicializaControles();

    this.listar(1,10);
  }
  onPaginateChange(event: PageEvent) {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.listar(pageIndex, pageSize);
  }
  listar(page: number=1, size:number=10){
    var data ={
      page: page,
      size: size,
      idInmueble: null,        
      nombre: this.formulario.controls['nombre'].value == '' ? null : this.formulario.controls['nombre'].value,
    };     
    this.objService.listar(data).subscribe((data: any)=>{           
      this.listarDto = data;      
      this.isLoading = false;
      console.log(this.listarDto)                   
    });
  }

}
