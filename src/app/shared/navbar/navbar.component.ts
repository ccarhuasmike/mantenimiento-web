import {Component, OnInit, Renderer2, ViewChild, ElementRef, Directive} from '@angular/core';
//import { ROUTES } from '../.././sidebar/sidebar.component';
import {Router, ActivatedRoute, NavigationEnd, NavigationStart} from '@angular/router';
import {Subscription, filter} from 'rxjs';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {ClienteService} from '@shared/services/cliente.service';
import {AuthService} from '@core/auth/auth.service';
import {ClientePorUsuarioDto} from '@core/models/ClienteDto';
import {CookieService} from 'ngx-cookie-service';
import {AzureService} from '@core/azure/azure.service';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

declare var $: any;

@Component({
  selector: 'app-navbar-cmp',
  templateUrl: 'navbar.component.html',
  providers: [CookieService],
})

export class NavbarComponent implements OnInit {
    private listTitles: any = [];
    location: Location;
    mobile_menu_visible: any = 0;
    private nativeElement: Node;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private _router: Subscription = new Subscription;
    datosEdi: any = {};
    srcLogo?: string="/assets/img/mibanco.png";
    listClientePorUsuario: ClientePorUsuarioDto[] = [];
    objetoClientePorUsuario: any;
    @ViewChild('app-navbar-cmp') button: any;
    constructor(
        private clienteService: ClienteService,
        private cookieService: CookieService,
        private _authService: AuthService,
        private clienteSeleccionado: ClienteService,
        location: Location,
        private renderer: Renderer2,
        private element: ElementRef,
        private router: Router,
        private azureService: AzureService,
      ) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
      }




  onSelectCliente(value: any) {

    this.clienteSeleccionado.cartEvent.next(value);

    if (value.ImagenLogoNombre) {
      this.azureService.downloadImage(value.ImagenLogoNombre, blob => {

        var reader = new FileReader();
        reader.onload = () => {
          const dataUrl: any = reader.result;
          const base64 = dataUrl.split(',')[1];
          this.srcLogo = 'data:image/png;base64, ' + base64;
        };
        reader.readAsDataURL(blob);
      })
    }

  }

  logout() {
    this._authService.signOut();
    setTimeout(() => {
      this.router.navigateByUrl("/");
    }, 1000);
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      misc.sidebar_mini_active = false;

    } else {
      setTimeout(function () {
        body.classList.add('sidebar-mini');

        misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  hideSidebar() {
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('sidebar')[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove('hide-sidebar');
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove('animation');
      }, 600);
      sidebar.classList.add('animation');

    } else {
      setTimeout(function () {
        body.classList.add('hide-sidebar');
        // $('.sidebar').addClass('animation');
        misc.hide_sidebar_active = true;
      }, 300);

    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  async ngOnInit() {
    //this.listTitles = ROUTES.filter(listTitle => listTitle);

    this.datosEdi = JSON.parse(this._authService.accessEdi);
    //const cookielistClientePorUsuario: any = this.cookieService.get('listClientePorUsuario');

    //if(this.cookieService.get('listClientePorUsuario')===''){

    var resgetClientesPorUsuarioFiltro = await this.clienteService.getClientesPorUsuarioFiltro("");
    this.listClientePorUsuario = resgetClientesPorUsuarioFiltro.map((x: any) => {


      return {
        Id: x.Id,
        NumeroDocumento: x.NumeroDocumento,
        Nombre: x.Nombre,
        NombreCorto: x.NombreCorto,
        ImagenLogoNombre: x.ImagenLogoNombre
      }
    });
    this.objetoClientePorUsuario = this.listClientePorUsuario.find(x => {
      return x.Id == this.datosEdi.IdCliente
    });
    this.cookieService.set('objetoClientePorUsuario', JSON.stringify(this.objetoClientePorUsuario));


    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    if (body.classList.contains('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    }
    if (body.classList.contains('hide-sidebar')) {
      misc.hide_sidebar_active = true;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.sidebarClose();
      const $layer = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
    });

    /* this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
       this.sidebarClose();
       const $layer = document.getElementsByClassName('close-layer')[0];
       if ($layer) {
         $layer.remove();
       }
     });*/
  }

  onResize(event: any) {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  sidebarOpen() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    setTimeout(function () {
      $toggle.classList.add('toggled');
    }, 430);

    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');


    if (body.querySelectorAll('.main-panel')) {
      document.getElementsByClassName('main-panel')[0].appendChild($layer);
    } else if (body.classList.contains('off-canvas-sidebar')) {
      document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    }

    setTimeout(function () {
      $layer.classList.add('visible');
    }, 100);

    $layer.onclick = function () { //asign a function

      body.classList.remove('nav-open');
      // @ts-ignore
      this.mobile_menu_visible = 0;
      // @ts-ignore
      this.sidebarVisible = false;

      $layer.classList.remove('visible');
      setTimeout(function () {
        $layer.remove();
        $toggle.classList.remove('toggled');
      }, 400);
    }.bind(this);

    body.classList.add('nav-open');
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  };

  sidebarClose() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');

    this.sidebarVisible = false;
    body.classList.remove('nav-open');
    // $('html').removeClass('nav-open');
    body.classList.remove('nav-open');
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function () {
      $toggle.classList.remove('toggled');
    }, 400);

    this.mobile_menu_visible = 0;
  };

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    let titlee: any = this.location.prepareExternalUrl(this.location.path());
    for (let i = 0; i < this.listTitles.length; i++) {
      if (this.listTitles[i].type === "link" && this.listTitles[i].path === titlee) {
        return this.listTitles[i].title;
      } else if (this.listTitles[i].type === "sub") {
        for (let j = 0; j < this.listTitles[i].children.length; j++) {
          let subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
          if (subtitle === titlee) {
            return this.listTitles[i].children[j].title;
          }
        }
      }
    }
    return 'Dashboard';
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  /* onchangeLogoCLiente(idCliente){
       this.clienteService.getClientesPorUsuarioFiltro
   }*/
}
