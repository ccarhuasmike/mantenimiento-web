import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GrupoMantenimientoFlatNode, GrupoMantenimientoNode } from "@core/models/grupomantenimientotree.model";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { SolicitudesService } from "@modules/solicitudes/services/solicitudes.service";
@Component({
  selector: 'app-autocomplete-grupounidad',
  templateUrl: './autocomplete-grupounidad.component.html',
  styleUrls: ['./autocomplete-grupounidad.component.css']
})
export class AutoCompleteGrupoUnidadComponent implements OnInit {
  @Input() value: any | undefined;
  @Input() setvalue: any | undefined;
  @Input() reset: any;
  @Output() valueResponse: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  //myControlGrupoMantenimiento = new FormControl('');
  ControlGrupoMantenimientoSeleccionado: any;
  NombreGrupoMantenimientoSeleccionado: any;
  /*Variables del Control Inmueble*/
  private _transformerGrupoMantenimiento = (node: GrupoMantenimientoNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      Id: node.Id,
      label: node.label,
      nivel: node.nivel,
      IdGrupoMantenimiento: node.IdGrupoMantenimiento,
      IdUnidadMantenimiento: node.IdUnidadMantenimiento,
      IdClasificacionProblema: node.IdClasificacionProblema
    };
  }
  treeControlGrupoMantenimiento = new FlatTreeControl<GrupoMantenimientoFlatNode>(node => node.level, node => node.expandable);
  treeFlattenerGrupoMantenimiento = new MatTreeFlattener(this._transformerGrupoMantenimiento, node => node.level, node => node.expandable, node => node.children);
  dataSourceGrupoMantenimiento = new MatTreeFlatDataSource(this.treeControlGrupoMantenimiento, this.treeFlattenerGrupoMantenimiento);
  hasChildGrupoMantenimiento = (_: number, node: GrupoMantenimientoFlatNode) => node.expandable;
  //datosBasicosFormGroup!: FormGroup;
  constructor(
    private solicitudesService: SolicitudesService,
  ) {

  }
  showDropDownGrupoMantenimiento = false;
  selectedmattreenodeGrupoMantenimiento(data: any) {
    this.valueResponse.emit(data);
    this.showDropDownGrupoMantenimiento = false;
  }

  getAncestorsGrupoUnidad(array: any, name: any) {
    if (array !== null) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].label === name) {
          return [array[i]];
        }
        const a: any = this.getAncestorsGrupoUnidad(array[i].children, name);
        if (a !== null) {
          a.unshift(array[i]);
          return a;
        }
      }
    }
    return null;
  }
  onLeafGrupoUnidadNodeClick(node: any): void {
    const ancestors = this.getAncestorsGrupoUnidad(this.dataSourceGrupoMantenimiento.data, node.label);
    var listGrupoUnidadSeleccionado: any = [];
    ancestors.forEach((ancestor: any) => {
      listGrupoUnidadSeleccionado.push(`${ancestor.label}`);
    });
    this.NombreGrupoMantenimientoSeleccionado = listGrupoUnidadSeleccionado.join(" / ");
    this.showDropDownGrupoMantenimiento = false;
    this.valueResponse.emit(node);
  }
  searchGrupoUnidad(buscar: string): void {
    this.isLoading = true;

    this.solicitudesService.getArbolGrupoUnidad(
      {
        IdCliente: this.value.IdCliente,
        IdTipoSolicitud: this.value.IdTipoSolicitud,
        Nombre: buscar,
        Origen: 1,
        UsuarioLogin: this.value.IdUsuario
      }
    ).then((responseGrupoMantenimiento) => {
      this.isLoading = false;
      if (responseGrupoMantenimiento.TipoResultado) {
        this.dataSourceGrupoMantenimiento.data = responseGrupoMantenimiento.Lista;
        if (this.dataSourceGrupoMantenimiento.data.length > 0) {
          this.showDropDownGrupoMantenimiento = true;
          //this.treeControlGrupoMantenimiento.expandAll();
        } else {
          this.showDropDownGrupoMantenimiento = false;
        }
        this.treeControlGrupoMantenimiento.collapseAll();
      }
    });
  }
  onKey(value: any) {
    this.searchGrupoUnidad(value.target.value);    
  }
  ngOnInit() {
    if (this.setvalue !== null || this.setvalue !== undefined)
      this.NombreGrupoMantenimientoSeleccionado = this.setvalue.label;  
  }
}
