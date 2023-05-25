import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http'
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './core/auth/auth.module';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SharedModule} from "@shared/shared.module";
var $ = require("jquery");
import {SidebarModule} from './sidebar/sidebar.module';
import {FooterModule} from './shared/footer/footer.module';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FixedpluginModule} from './shared/fixedplugin/fixedplugin.module';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { ComponentsModule } from './components/components.module';
@NgModule({
  declarations: [
    AdminLayoutComponent,
    AuthLayoutComponent,
    AppComponent
  ],
  imports: [
    ComponentsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    SharedModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,

   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
