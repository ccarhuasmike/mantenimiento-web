import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit {
  private toggleButton: any;
  private sidebarVisible: boolean;
  mobile_menu_visible: any = 0;
  

  constructor(private router: Router, private element: ElementRef) {
      this.sidebarVisible = false;
  }
  ngOnInit(){
    
  }
  sidebarOpen() {
    
  };
  sidebarClose() {
    
  };
  sidebarToggle() {
    
  }
}
