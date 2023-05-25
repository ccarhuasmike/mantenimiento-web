import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DispositivoModel } from "@core/models/dispositivo.model";
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialogo-dispositivo',
  templateUrl: './dialogo-dispositivo.component.html',
  styleUrls: ['./dialogo-dispositivo.component.css']
})
export class DialogoDispositivoComponent implements OnInit {


  public environment: string = "";

  public auxAtribute: boolean = false;

  public infraredNum: number = 0;

  public formControled!: UntypedFormGroup;
  constructor(public dialogo: MatDialogRef<DialogoDispositivoComponent>, private elementRef: ElementRef,

    @Inject(MAT_DIALOG_DATA) public data: DispositivoModel, private formBuilder: FormBuilder,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    ) {


    switch (data.category) {
      case "wnykq":
        this.formControled = this.formBuilder.group({
          switch: [false],

        });


        break;
      case "infrared_ac":
        this.formControled = this.formBuilder.group({
          switch: [false],

        });
        break;
      case "pir":
        this.formControled = this.formBuilder.group({
          switch: [''],
        });
        break;
      case "cz":
        this.formControled = this.formBuilder.group({
          switch: [''],
        });
        break;
    }

  }

  ngOnInit(): void {
    this.environment = environment.apiImageTuya;

  }

  handlePower($event:boolean){
    this.formControled.patchValue({
      switch:$event
    })
  }

  handleSwitch($event:boolean){
    this.formControled.patchValue({
      switch:$event
    })
  }


  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }

  confirmado(): void {
    this.dialogo.close({
      respuesta: true,
    });
  }



  SubmitControled() {
    console.log(this.formControled.value)
  }




  handleControled(data:any)
  {
    if(data){
      this.auxAtribute=true

    }


  }
  handleReturn(){
    this.auxAtribute=false
  }


  hanleInfrared($value: number) {
    this.infraredNum = $value
  }
}
