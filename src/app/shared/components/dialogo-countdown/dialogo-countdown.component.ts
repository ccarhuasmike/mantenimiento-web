
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { DatePipe } from '@angular/common';
export interface DatosReloj {
  fechaFin: string;
  relojCorre: boolean;
}
@Component({
  selector: 'app-dialogo-countdown',
  templateUrl: './dialogo-countdown.component.html',
  styleUrls: ['./dialogo-countdown.component.css']
})
export class DialogoCountdownComponent implements OnInit, OnDestroy {
  @Input() DataReloj!: DatosReloj;
  refreshpage: boolean = false;
  progressDay = 0;
  progressHora = 0;
  progressMin = 0;
  progressSeg = 0;
  intervalId: any;
  count = 0;
  fechaFin!:string ;
  TitleDias: Array<string> = [];
  TitleHora: Array<string> = [];
  TitleMin: Array<string> = [];
  TitleSeg: Array<string> = [];
  date: any;
  now: any;

  targetDate: any;
  targetTime: any;
  difference!: number;


  days_number!: number;
  hours_number!: number;
  minutes_number!: number;
  seconds_number!: number;

  constructor(
    private datePipe: DatePipe,
  ) { }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  ngOnInit() {
    this.fechaFin=this.datePipe.transform(this.DataReloj.fechaFin, 'dd/MM/yyyy HH:mm:ss') as string ;    
    this.refreshpage = true; 
    //this.targetDate = this.formatDate('02/11/2022 14:23:16');
    this.targetDate = this.formatDate(this.fechaFin);
    this.targetTime = this.targetDate.getTime();
    if(this.DataReloj.relojCorre){
      setInterval(() => {
        this.tickTock();      
      }, 1000);
    }else{
      this.tickTock(); 
    }  
  }
  tickTock() {   
    this.date = new Date();
    this.now = this.date.getTime();
    this.difference = this.targetTime - this.now;    
    this.days_number = Math.floor(this.difference / (1000 * 60 * 60 * 24));    
    this.hours_number = Math.floor((this.difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes_number = Math.floor((this.difference % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds_number = Math.floor((this.difference % (1000 * 60)) / 1000);    
    this.days_number = isNaN(this.days_number) ? 0 : this.days_number;

    this.TitleDias = [this.days_number < 0 ? "0" : this.days_number.toString(), "Dias"]
    this.TitleHora = [this.hours_number.toString(), "Horas"]
    this.TitleMin = [this.minutes_number.toString(), "Minutos"]
    this.TitleSeg = [this.seconds_number.toString(), "Segundo"]

    if (this.refreshpage) {
      this.progressSeg = 100;
      this.progressSeg = (this.seconds_number / 60) * 100;/*Sacacamos el porcentaje faltante del segundo */      

      this.progressMin = 100;
      this.progressMin = (this.minutes_number / 60) * 100;/*Sacacamos el porcentaje faltante del minutos */
     
      this.progressHora = 100;
      this.progressHora = (this.hours_number / 24) * 100;/*Sacacamos el porcentaje faltante del hora */     
    }

    this.refreshpage = false;//Marcamos que ya se hizo nuevo calculo despues de refrescar la pagina
    /*Samos los porcetajes de los dia trancurridos */
    if (this.days_number > 0) {
      this.progressDay = 100;
      this.progressDay = Math.round((this.days_number / 365) * 100);/*Sacacamos el porcentaje faltante del day */

      if (this.progressDay < 1) {
        this.progressDay = 100; // Reiniciamos el contador      
      } else {
        this.progressDay = this.progressDay - (100 / 365);// sacamos el porcetaje a contar por cada hora que pasa
      }
    }
    /*Samos los porcetajes de los hora trancurridos */
    if (this.progressHora < 1) {
      this.progressHora = 100; // Reiniciamos el contador      
    } else {
      if (this.minutes_number == 60) {
        this.progressHora = this.progressHora - (100 / 24);// sacamos el porcetaje a contar por cada hora que pasa
      }
    }

    /*Samos los porcetajes de los minutos trancurridos */
    if (this.progressMin < 1) {
      this.progressMin = 100; // Reiniciamos el contador      
    } else {
      if (this.seconds_number == 60) {
        this.progressMin = this.progressMin - (100 / 60);// sacamos el porcetaje a contar por cada minutos que pasa
      }
    }
    
    //this.progressHora = isNaN(this.progressHora) ? 0 : this.progressHora
    /*Samos los porcetajes de los segundos trancurridos */
    if (this.progressSeg < 1) {
      this.progressSeg = 100; // Reiniciamos el contador      
    } else {
      this.progressSeg = this.progressSeg - (100 / 60);// sacamos el porcetaje a contar por cada segundo que pasa
     
    }
  }
  formatDate(dateStr: string) {
    let dateComponents = dateStr.split(' ')[0]
    let timeComponents = dateStr.split(' ')[1]

    let day = dateComponents.split('/')[0];
    let month = parseInt(dateComponents.split('/')[1]);
    let year = dateComponents.split('/')[2];

    let hours = timeComponents.split(':')[0];
    let minutes = timeComponents.split(':')[1];
    let seconds = timeComponents.split(':')[2];

    return new Date(+year, month - 1, +day, +hours, +minutes, +seconds);
  }

}
