import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './page/auth-page.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings ,RecaptchaFormsModule} from 'ng-recaptcha';
import { environment } from './../../../environments/environment';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [
    AuthLayoutComponent,
  ],
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    FormsModule
  ],
  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.ClientKeyCaptcha
    } as RecaptchaSettings,
  }]
})
export class AuthModule { }
