import { Component, EventEmitter, Input, OnInit, Output, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ClienteService } from '@modules/administracion/services/Cliente.service';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { MatTable } from '@angular/material/table';
import { TmAdjunto } from '@core/models/TmAdjunto-interface';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AssetService } from '@shared/services/asset.service';
import { AzureService } from '@core/azure/azure.service';
import { MatDialog } from "@angular/material/dialog";
import {  DialogoConfirmacionComponent} from '../../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',

})
export class EditarClienteComponent implements OnInit {
  objRegistro: any;
  formulario!: FormGroup;
  srcFoto?: string;  
  @ViewChild(MatTable) table?: MatTable<TmAdjunto>;
  constructor(
    private clienteService: ClienteService,
    public router: Router,
    private route: ActivatedRoute,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private fb: FormBuilder,
    private assetService:AssetService,
    private azureService: AzureService,
    public dialogo: MatDialog
  ) {
  }
  async ngOnInit() {
    this.formulario = this.fb.group({
      urlFoto: []
    });
    let nombreArchivoLogo: any = this.route.snapshot.paramMap.get('nombreArchivoLogo');
    if(nombreArchivoLogo!="null"){

      this.azureService.downloadImage(nombreArchivoLogo, blob => {

        this.formulario.controls['urlFoto'].setValue("logo.png");
        var reader = new FileReader();
        reader.onload = () => {
          const dataUrl: any = reader.result;
          const base64 = dataUrl.split(',')[1];
          this.srcFoto = 'data:image/png;base64, ' + base64;
        };
        reader.readAsDataURL(blob);
      })
    }    
  }

  
  actualizar(req: any) {
  }
  onFileSelected(event: any) {

    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',  
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `Recuerde que este logo reemplazará al existente, Desea continuar?`
      }
    })
    .afterClosed()
    .subscribe(async (confirmado: Boolean) => {    
    const file = event.target.files[0];
        if (file) {
          const blob = new Blob([file], { type: file.type });
          const response =  await this.azureService.uploadFile(blob, file.name);
          let idCliente: any = this.route.snapshot.paramMap.get('id');
          
          var requestLogo ={
            NombreExterno : file.name,
            Nombre  : file.name,
            NombreInterno : response.uuidFileName, 
            Tamanio : file?.size,
            NombreExtension: "." + file.name.split(".").pop(),
            CodigoTabla : 205,
            NumeroGrupo : 10,
            IdEntidad : idCliente
          };
          this.assetService.subirArchivoAzureIndividual(requestLogo).subscribe((asset: any) => {
              this.formulario.controls['urlFoto'].setValue(file.name);
              var reader = new FileReader();
              reader.onload = (event: any) => {
                  console.log(event.target.result);
                  this.srcFoto = event.target.result;
              }
                reader.readAsDataURL(event.target.files[0]);          
            });  
        }
    }); 
  }
}