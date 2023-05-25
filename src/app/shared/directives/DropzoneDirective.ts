

import { Directive, HostListener, Output,Input, EventEmitter } from '@angular/core';

@Directive({
  selector: '[dropzone]'
})
export class DropzoneDirective {

  @Output() dropped =  new EventEmitter<FileList>();
  @Output() hovered =  new EventEmitter<boolean>();
  @Input() preventBodyDrop = true;
  @HostListener('drop', ['$event'])
  onDrop($event:any) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event:any) {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event:any) {
    $event.preventDefault();
    this.hovered.emit(false);
  }
  @HostListener('body:dragover', ['$event'])
  onBodyDragOver(event: DragEvent) {

    if (this.preventBodyDrop) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  @HostListener('body:drop', ['$event'])
  onBodyDrop(event: DragEvent) {

    if (this.preventBodyDrop) {
      event.preventDefault();
    }
  }
}
