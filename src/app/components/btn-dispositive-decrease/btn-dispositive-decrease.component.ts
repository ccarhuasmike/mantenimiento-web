import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-btn-dispositive-decrease',
  templateUrl: './btn-dispositive-decrease.component.html',
  styleUrls: ['./btn-dispositive-decrease.component.css']
})
export class BtnDispositiveDecreaseComponent implements OnInit {
  @Output() $value = new EventEmitter<number>();
  @Input() valueDecrement!:number;
  @Input() total!:number
  constructor() { }

  ngOnInit(): void {
  }
  handleClick(e:number){
    let drecrement=this.total+e
    this.$value.emit(drecrement)
  }
}
