import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClienteService } from '@shared/services/cliente.service';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [ RouterModule, CommonModule, MatButtonModule,MatSelectModule ,MatFormFieldModule,MatTooltipModule,FormsModule],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ],
    providers: [  
        ClienteService,
        
      ],
})

export class NavbarModule {}
