import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-power-dispositive',
  templateUrl: './power-dispositive.component.html',
  styleUrls: ['./power-dispositive.component.css']
})
export class PowerDispositiveComponent implements OnInit {
  @Input() dispositiveState!:boolean;
  @Output() setDispositive = new EventEmitter<boolean>();
  
  @ViewChild('miBoton') miBoton!: ElementRef;
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.miBoton.nativeElement.setAttribute("aria-pressed", `${this.dispositiveState}`);
    if (this.dispositiveState) {
      this.removePanelClass('customModal')
    } else {
      this.addPanelClass('customModal');

    }
  }

  actionPower() {
    //false

    let auxCustom = !this.dispositiveState
    this.miBoton.nativeElement.setAttribute("aria-pressed", `${auxCustom}`);

    if (auxCustom) {
      this.removePanelClass('customModal')
      this.setDispositive.emit(auxCustom)

    } else {

      this.addPanelClass('customModal');
      this.setDispositive.emit(auxCustom)
    }


  }

  addPanelClass(classToAdd: string) {
    const containerElement = this.elementRef.nativeElement.closest('.mat-dialog-container');
    containerElement.classList.add(classToAdd);
  }
  removePanelClass(classToRemove: string) {
    const containerElement = this.elementRef.nativeElement.closest('.mat-dialog-container');
    containerElement.classList.remove(classToRemove);

  }
}
