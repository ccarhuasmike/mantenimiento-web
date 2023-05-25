import {Component, OnInit, ViewChild} from "@angular/core";
import {
  AbstractControl,
  UntypedFormArray,
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl
} from "@angular/forms";
import {Chart, ChartConfiguration, ChartEvent, ChartType} from 'chart.js';
import {default as Annotation} from 'chartjs-plugin-annotation';
import {BaseChartDirective} from "ng2-charts";

declare function Gammacdf(a: any, b: any): any;

@Component({
  selector: 'app-confiabilidad',
  templateUrl: 'confiabilidad.component.html',
  styleUrls: ['confiabilidad.component.css'],

})

export class ConfiabilidadComponent implements OnInit {

  tdias = 0;
  total = 0;
  r = 0;
  name = 'nombre';
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder
  ) {
    Chart.register(Annotation)
    this.userForm = this.fb.group({
      name: [],
      phones: this.fb.array([
        this.fb.control({
          to: 0,
          tes: 0,
        })
      ])
    })
  }

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public emailForm!: FormGroup;

  ngOnInit(): void {

    this.emailForm = this.formBuilder.group({
      datos: this.formBuilder.array([this.createEmailFormGroup()])
    });

    this.emailForm.valueChanges.subscribe(value => {
      const nfallas = value.datos.length;
      let etiquetas: any = [];
      let anterior = 0;
      value.datos.forEach((x: any, i: number) => {
        etiquetas.push(anterior + x.to)
        anterior = x.to;
      });
      this.lineChart1Data.datasets.forEach((x, i) => {
        x.data = Array.from({length: nfallas}, (x, i) => i + 1);
      })
      this.lineChart1Data.labels = etiquetas;
      this.chart?.update();
    });
  }

  standardDeviation = (arr: any, usePopulation = false) => {
    const mean = arr.map((o: any) => o.to).reduce((acc: any, val: any) => acc + val, 0) / arr.length;
    return Math.sqrt(arr.map((o: any) => o.to).reduce((acc: any, val: any) => acc.concat((val - mean) ** 2), []).reduce((acc: any, val: any) => acc + val, 0) / (arr.length - (usePopulation ? 0 : 1)));
  };

  onSubmit(event: any) {
    this.total = 10;
    if (this.emailForm.invalid) {
      return;
    }
    const data = this.emailForm.value.datos;
    const sumaTiempoOperativo = data.map((o: any) => o.to).reduce((a: number, c: number) => {
      return a + c
    });
    const totalRegistros = data.length;
    const sumaytotal = sumaTiempoOperativo / totalRegistros;
    const desviacionEstandar = this.standardDeviation(data);
    if (event.submitter.name == "btn1") {
      //AL1107 sumaytotal
      //AL1108 desviacionEstandar
      const calculo1 = Math.pow((sumaytotal / desviacionEstandar), 2);
      const calculo2 = Math.pow(desviacionEstandar, 2) / sumaytotal;
      let Prob = Gammacdf(this.tdias / calculo2, calculo1);
      Prob = Math.round(Prob * 100000) / 100000;
      this.r = (1 - Prob) * 100;
    }
  }

  public confiabilidad1: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Fiabilidad',
        backgroundColor: 'rgb(232,49,10)',
        borderColor: 'rgb(232,49,10)',
        pointBackgroundColor: 'rgb(232,49,10)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(232,49,10)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March']
  };

  public confiabilidad2: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Prob. de fallo',
        backgroundColor: 'rgb(107,255,0)',
        borderColor: 'rgb(107,255,0)',
        pointBackgroundColor: 'rgb(107,255,0)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March']
  };

  public confiabilidad3: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Función de densidad',
        backgroundColor: 'rgb(84,144,255)',
        borderColor: 'rgb(84,144,255)',
        pointBackgroundColor: 'rgb(84,144,255)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March']
  };

  public confiabilidad4: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Fallo / Tiempo',
        backgroundColor: 'rgb(255,213,0)',
        borderColor: 'rgb(255,213,0)',
        pointBackgroundColor: 'rgb(255,213,0)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March']
  };

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgb(227,228,231)',
        },
        ticks: {
          color: 'rgb(141,113,189)'
        }
      }
    }
  };

  public lineChart1Data: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [0],
        label: 'Tendencia de la frecuencia de fallos en el tiempo',
        borderColor: '#463F7E',
        pointBackgroundColor: '#463F7E',
        backgroundColor: '#463F7E'
      }
    ],
    labels: []
  };

  public lineChart1Options: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'T.acum Dia(s)'
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'n° falla'
        },
        min: 0
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (val) => {
            return `N° falla: ${val.raw}`
          },
          title: (val) => {
            return `Tiempo acumulado: ${val[0].label}`
          }
        }
      },
      legend: {display: true},
      annotation: {
        annotations: [
          {
            type: 'line',
            yMin: 0,
            yMax: 50,
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              display: true,
              position: 'center',
              color: 'orange',
              content: 'Tendencia',
              font: {
                weight: 'bold'
              }
            }
          },
        ],
      }
    }
  };

  limpiar() {
    (this.userForm.get('phones') as UntypedFormArray).clear();
  }

  getPhonesFormControls(): AbstractControl[] {
    return (<UntypedFormArray>this.userForm.get('phones')).controls
  }

  public addEmailFormGroup() {
    const datos = this.emailForm.get('datos') as FormArray
    datos.push(this.createEmailFormGroup())
  }

  getControls() {
    var respuesta = this.emailForm.get('datos') as FormArray
    return respuesta.controls;
  }

  public removeOrClearEmail(i: number) {
    const datos = this.emailForm.get('datos') as FormArray
    if (datos.length > 1) {
      datos.removeAt(i)
    } else {
      datos.reset()
    }
  }

  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      'to': new FormControl(0),
      'tes': new FormControl(0),
    })
  }
}
