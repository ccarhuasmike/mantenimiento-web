import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch-dispositive',
  templateUrl: './switch-dispositive.component.html',
  styleUrls: ['./switch-dispositive.component.css']
})
export class SwitchDispositiveComponent implements OnInit {
  @Input() dispositiveState!:boolean;
  @Output() setDispositive = new EventEmitter<boolean>();
  public checkedSwitch!:boolean;
   
  constructor( private elementRef: ElementRef) { 


  }

  ngOnInit(): void {

    this.checkedSwitch=this.dispositiveState;
  }

  ngAfterViewInit() {
    if (this.dispositiveState) {
      
      this.removePanelClass('customModal')


    } else {

      this.addPanelClass('customModal');

    }
  }

  handleChangeSwitch(e: any) {
    // console.log(e.targe.checkedt)
    if (this.checkedSwitch) {
      this.removePanelClass('customModal')
      
      this.setDispositive.emit(this.checkedSwitch)
    } else {
      this.addPanelClass('customModal');
      this.setDispositive.emit(this.checkedSwitch)
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
