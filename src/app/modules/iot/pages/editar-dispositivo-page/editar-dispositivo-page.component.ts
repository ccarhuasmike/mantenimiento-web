import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-dispositivo-page',
  templateUrl: './editar-dispositivo-page.component.html',
  styleUrls: ['./editar-dispositivo-page.component.css']
})
export class EditarDispositivoPageComponent implements OnInit {
  //editGroup!: FormGroup;

  constructor(private route: ActivatedRoute) {
    /*this.editGroup = this.formBuilder.group({
      data1: ['', Validators.required],

    });*/
  }

  ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id');
    console.log(heroId);
  }

  sendSubmit() {
  //  console.log(this.editGroup.value)
  }

}
