import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
/*import { create, SheetsRegistry } from "jss";
import preset from "jss-preset-default";

const jss = create(preset());
const styles = {
  singleLine: `
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    white-space: pre-wrap;
  `,
  printAreaContainer: `
    padding: 8px;
  `,
  fontMono: {
    fontFamily: "monospace"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  textLeft: {
    textAlign: "left"
  },
  fontBold: {
    fontWeight: "bold"
  },
  grid3Col: {
    display: "grid",
    columnGap: "5px",
    gridTemplateColumns: "1fr auto auto"
  },
  gridBorderSolid: `
    border-bottom: 1px solid;
  `,
  gridBorderDashed: `
    border-bottom: 1px dashed;
  `,
  gridBorderDouble: `
    border-bottom: 3px double;
  `,
  gridBorder: `
    grid-column: 1 / -1;
    margin: 4px 0;
  `,
  nowrap: {
    overflow: "hidden",
    textOverflow: "clip",
    whiteSpace: "nowrap"
  },
  colSpan2: {
    gridColumn: "span 2 / span 2"
  },
  maxLine2: {
    maxHeight: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
};
const sheets = new SheetsRegistry();
const sheet = jss.createStyleSheet(styles);
sheets.add(sheet);
const { classes } = sheet.attach();
 */
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  providers: []
})
export class PrintPageComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
 /* @Input()
  width!: "80mm";
  classes = classes;

  constructor(private elementRef: ElementRef) {}

  print(): void {
    const tpm = new ThermalPrinterService(this.width);
    const styles = sheets.toString();
    console.log(this.elementRef.nativeElement.innerHTML);
    console.log(styles);
    tpm.setStyles(styles);
    tpm.addRawHtml(this.elementRef.nativeElement.innerHTML);
    tpm.print();
  }
}

class ThermalPrinterService {
  printContent = ``;
  cssStyles = ``;

  constructor(private paperWidth: "80mm" | "58mm") {}

  addRawHtml(htmlEl) {
    this.printContent += `\n${htmlEl}`;
  }

  addLine(text) {
    this.addRawHtml(`<p>${text}</p>`);
  }

  addLineWithClassName(className, text) {
    this.addRawHtml(`<p class="${className}">${text}</p>`);
  }

  addEmptyLine() {
    this.addLine(`&nbsp;`);
  }

  addLineCenter(text) {
    this.addLineWithClassName("text-center", text);
  }

  setStyles(cssStyles) {
    this.cssStyles = cssStyles;
  }

  print() {
    const printerWindow = window.open(``, `_blank`);
    printerWindow.document.write(`
    <!DOCTYPE html>
    <html>
    
    <head>
      <title>Print</title>
      <style>
        html { padding: 0; margin: 0; width: ${this.paperWidth}; }
        body { margin: 0; }
        ${this.cssStyles}
      </style>
      <script>
        window.onafterprint = event => {
          window.close();
        };
      </script>
    </head>

    <body>
      ${this.printContent}
    </body>
    
    </html>
    
    `);

    printerWindow.document.close();
    printerWindow.focus();
    printerWindow.print();
    // mywindow.close();
  }*/

  
  
}
