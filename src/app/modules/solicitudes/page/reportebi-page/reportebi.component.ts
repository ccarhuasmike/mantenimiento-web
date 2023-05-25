import {Component, OnInit, ViewChild} from '@angular/core';
import * as pbi from 'powerbi-client';

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  test:string;
  test1:string;
  test2:string;
  test3:string;
  test4:string;
  test5:string;
  test6:string;
  test7:string;
  test8:string;
}

@Component({
  selector: 'app-reportebi',
  templateUrl: './reportebi.component.html',
  styleUrls: ['./reportebi.component.css']
})
export class ReporteBIComponent implements OnInit {


  ngOnInit(): void {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZjkwNDIxOGItNGY5Yy00NmQwLTk4YTgtMTgwZjljOTRkZTg4LyIsImlhdCI6MTY2MDA3ODYxMiwibmJmIjoxNjYwMDc4NjEyLCJleHAiOjE2NjAwODM0MDgsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJFMlpnWU5Edk01S3ppVmpzTXkvb09lTzVNNzYvenJGcGJOQ05sTjg2NVhub3UrV0hyQm9BIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjNiMmQwZGFlLWI0MWYtNDU1MC1hODQyLWQ0OGQwMmQxYWJhOSIsImFwcGlkYWNyIjoiMCIsImlwYWRkciI6IjE3OS42LjIyMy4zNSIsIm5hbWUiOiJHZXN0aW9uIGRlIEVkaWZpY2lvcyB5IE1hbnRlbmltaWVudG8gRURJIiwib2lkIjoiNWYzNDUzZmItYzFlMC00MTUyLTgyZjgtMTY0YWU3ZDU3OTg2IiwicHVpZCI6IjEwMDMwMDAwQTE3RjAwNDUiLCJyaCI6IjAuQVFZQWl5RUUtWnhQMEVhWXFCZ1BuSlRlaUFrQUFBQUFBQUFBd0FBQUFBQUFBQUFHQVA0LiIsInNjcCI6IkFwcC5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkV3JpdGUuQWxsIENvbnRlbnQuQ3JlYXRlIERhc2hib2FyZC5SZWFkLkFsbCBEYXNoYm9hcmQuUmVhZFdyaXRlLkFsbCBEYXRhZmxvdy5SZWFkLkFsbCBEYXRhZmxvdy5SZWFkV3JpdGUuQWxsIERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdhdGV3YXkuUmVhZC5BbGwgR2F0ZXdheS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInN1YiI6IjdMd0g5RmJxTm80MmNMTEE3RGZnUlBMeXpJRUVzSVJwWDJkWnZvQnlTY2siLCJ0aWQiOiJmOTA0MjE4Yi00ZjljLTQ2ZDAtOThhOC0xODBmOWM5NGRlODgiLCJ1bmlxdWVfbmFtZSI6Imdlc3Rpb25kZWVkaWZpY2lvc3ltYW50ZW5pbWllbnRvZWRpQHZhbHR4LnBlIiwidXBuIjoiZ2VzdGlvbmRlZWRpZmljaW9zeW1hbnRlbmltaWVudG9lZGlAdmFsdHgucGUiLCJ1dGkiOiI4WEZfdXpiU0JFS2FsbHNuNjQyN0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJhOWVhODk5Ni0xMjJmLTRjNzQtOTUyMC04ZWRjZDE5MjgyNmMiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.ZGDIv_v6Pug5C3frE7ue79KaRIr7fTkYeB9gzK35LKsnYmyioH20P4PtI1bNLGUYobkMXWY7l7lb8fq1ESbcRgVFDA7CmCFODF1YM0a1OgoXsTnZKJjc170oMIgv3yuQpVmL3QkKQOsj5aPpGVYajRtnnf3XvZzH3jSv8UFl34xgLisbDsrOiNeYtnBaESjJR99oOxv5uropjDqN9IQA0HHI6MNxuHSYt7cxPDBMnbyxz59vLbyUNT7eBQbYEpUJs1zKGY-l8U6XJlU5I3SJ1huXHzlqOobndK2j_Cs0wtY_PAMSsM5CNaOW-NwvOZaeHACHnR2Kp9b3ohrcZL9SwQ";
    this.showReport(token);
  }

  showReport(accessToken: string) {

    // Embed URL
    // let embedReportId = "024596db-4215-4d02-8c95-fd2f421d563b";//TICKETS EDI
    // let embedReportGroup = "ab52eed0-6457-4b3d-940c-d46574f4d1fe"; //TICKETS EDI

    let embedReportId = "15921f21-1d0b-4bd8-8e96-14252e97429c";
    let embedReportGroup = "f175c2b4-39a3-4d42-b012-beb148ec8efe";

    // const url = "https://app.powerbi.com/reportEmbed?reportId=15921f21-1d0b-4bd8-8e96-14252e97429c&autoAuth=true&ctid=f904218b-4f9c-46d0-98a8-180f9c94de88&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXNvdXRoLWNlbnRyYWwtdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D";

    let embedUrl = "https://app.powerbi.com/reportEmbed?reportId=" + embedReportId + "&groupId=" + embedReportGroup;//POWERBI.GROUP_ID;
    let config = {
      type: 'report',
      embedUrl: embedUrl,
      accessToken: accessToken,
      permissions: pbi.models.Permissions.Read,
      settings: {
        background: pbi.models.BackgroundType.Default,
        panes: {
          bookmarks: {
            visible: false
          },
          fields: {
            expanded: true
          },
          filters: {
            expanded: false,
            visible: false
          },
          pageNavigation: {
            visible: true
          },
          selection: {
            visible: true
          },
          syncSlicers: {
            visible: true
          },
          visualizations: {
            expanded: true
          }
        }
      }
      //,
      //filters: [basicFilter]
    };
    let reportContainer = <HTMLElement>document.getElementById('reportContainer');
    let powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory);

    let report = powerbi.embed(reportContainer, config);
    report.off("loaded");
    report.on("loaded", () => {
      
    });
    report.on("error", () => {
      console.log('Error al cargar bi')
    });
  }

}
