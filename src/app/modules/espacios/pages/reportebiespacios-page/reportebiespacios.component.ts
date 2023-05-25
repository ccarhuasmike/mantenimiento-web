import {Component, OnInit, ViewChild} from '@angular/core';
import { EspaciosService } from '@modules/espacios/services/espacio.service';
import { IReportEmbedConfiguration, models } from 'powerbi-client';

export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}

@Component({
  selector: 'app-reportebiespacios',
  templateUrl: './reportebiespacios.component.html',
  styleUrls: ['./reportebiespacios.component.css']
})
export class ReporteBIEspaciosComponent implements OnInit {
  reportClass = 'report-container hidden';
  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };
  constructor(    
    private espaciosService: EspaciosService    
  ) {  
  }
  async ngOnInit() {    
    var datosReporte  =  await this.espaciosService.postTokenBI()
    this.reportConfig = {
      ...this.reportConfig,
      id: datosReporte.embedReport[0].reportId,
      embedUrl: datosReporte.embedReport[0].embedUrl,
      accessToken: datosReporte.embedToken.token,
      tokenType: models.TokenType.Embed,
        settings: {
            panes: {
                filters: {
                    expanded: false,
                    visible: false
                }
            },
            background: models.BackgroundType.Transparent,
        }
    }; 
  }

  
}
