import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-btn-dispositive-increase',
  templateUrl: './btn-dispositive-increase.component.html',
  styleUrls: ['./btn-dispositive-increase.component.css']
})
export class BtnDispositiveIncreaseComponent implements OnInit {
  @Output() $value = new EventEmitter<number>();
  @Input() valueIncrement!:number;
  @Input() total!:number
  constructor() { }

  ngOnInit(): void {
  }
  handleClick(e:number){
    let drecrement=this.total+e
    this.$value.emit(drecrement)
  }
}
