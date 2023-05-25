import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-controlador-iot-page',
  templateUrl: './controlador-iot-page.component.html',
  styleUrls: ['./controlador-iot-page.component.css']
})
export class ControladorIotPageComponent implements OnInit {  

  public invoiceIds!:string;
  constructor( private  activateRoute:ActivatedRoute ) { }
  ngOnInit(): void {

    const dispositivo = JSON.parse(this.activateRoute.snapshot.queryParams['dispositive']);
 
    console.log(dispositivo);
  }

}
