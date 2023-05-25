import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-dispositive-controled',
  templateUrl: './dispositive-controled.component.html',
  styleUrls: ['./dispositive-controled.component.css']
})
export class DispositiveControledComponent implements OnInit {

  @Input() data!:any;
  public formControled!: UntypedFormGroup;
  public infraredNum: number = 0;
  constructor( private formBuilder: FormBuilder) {






   }

  ngOnInit(): void {
    
    switch (this.data) {
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

  SubmitControled(){}

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
  
  hanleInfrared($value: number) {
    this.infraredNum = $value
  }
}
