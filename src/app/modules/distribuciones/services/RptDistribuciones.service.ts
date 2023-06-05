import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class RptDistribucionExcelService {

constructor() { }

public exportReport(json: any[], excelFileName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const Excel = require('exceljs');
    const Workbook = new Excel.Workbook();
    //const title = "Reporte Ordenes de Entrega";
    //const subtitle1 = "Rango : " + FecIni + " - " + FecFin;
    let header = ["Codigo OE",
                  "Glosa",
                  "Origen",
                  "Dirección",
                  "Destino",
                  "Dirección",
                  "Fecha Estimada Entrega",
                  "Fecha Real Entrega",
                  ];
  
    const workbook = Workbook;
    const worksheet = workbook.addWorksheet("Reporte_ordenes_entrega");
    //const titleRow = worksheet.addRow([title]);
   // worksheet.addRow([subtitle1]);
    //titleRow.font = { name: 'Calibri', family: 4, size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
  
    // const logo = Workbook.addImage({ base64:'data:image/jpeg;base64,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',
    // extension: 'png'});
  
    // worksheet.addImage(logo, 'A1:B3');
    // worksheet.mergeCells('A1:R1'); 
    // worksheet.mergeCells('A2:R2'); 
  
    // Fila en blanco
    // worksheet.addRow([]);
    
    const headerRow = worksheet.addRow(header);
    headerRow.alignment = { horizontal: 'center' };
    headerRow.font = { name: 'Calibri', family: 4, size: 11, bold: true, color:  { argb: 'ffffff' }};
    headerRow.eachCell((cell:any, number1:any) => {      
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'a30000' }, bgColor: { argb: 'a30000' }};
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};          
      });
    
    const Filas = json.length;
    for (let i = 0; i < Filas; i++) {         
      const dato = [
                    json[i].Codigo,
                    json[i].Glosa,
                    json[i].Origen,
                    //(json[i].INICIOVIGENCIA == '' || json[i].INICIOVIGENCIA == null)?'':new Date(Date.parse(json[i].INICIOVIGENCIA)),
                    //(json[i].FINVIGENCIA == '' || json[i].FINVIGENCIA == null)?'':new Date(Date.parse(json[i].FINVIGENCIA)),
                    //(json[i].VENCIMIENTO == '' || json[i].VENCIMIENTO == null)?'':new Date(Date.parse(json[i].VENCIMIENTO)),
                    json[i].DireccionOrigen,
                    json[i].Destino,
                    json[i].DireccionDestino,
                    json[i].FechaEstimadaEntrega,
                    json[i].FechaDespacho
                    //(json[i].EMISION == '' || json[i].EMISION == null)?'':new Date(Date.parse(json[i].EMISION))
      ];
      
      const row = worksheet.addRow(dato);
  
      row.eachCell((cell:any, number1:any) => {  
/*           if(number1 == 1 || number1 == 2)    
        {
          cell.alignment = { horizontal: 'center' };
        }  */     
        if(number1 == 4 || number1 == 5 || number1 == 6 || number1 == 17)    
        {
          cell.numberFormat = "dd/MM/yyyy";
        }
        if(number1 == 16)    
        {
          cell.numberFormat = "###,##0.00";
          //cell.alignment = { horizontal: 'right' };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};      
      });  
    }
     
    worksheet.getColumn(1).width = 17;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 14;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 45;
    // worksheet.getColumn(9).width = 18;
    // worksheet.getColumn(10).width = 18;
    // worksheet.getColumn(11).width = 45;
    // worksheet.getColumn(12).width = 45;
    // worksheet.getColumn(13).width = 18;
    // worksheet.getColumn(14).width = 80;
    // worksheet.getColumn(15).width = 18;
    // worksheet.getColumn(16).width = 18;
    // worksheet.getColumn(17).width = 18;
    // Generando archivo excel
    workbook.xlsx.writeBuffer().then((data:any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, excelFileName + '.xlsx');
    }).then(() => {
      resolve(true);
    });
  });
}

}
