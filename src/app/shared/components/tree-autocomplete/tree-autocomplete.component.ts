import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
  HostListener,
  forwardRef,
  Self,
  HostBinding,
  Input,
  Optional
} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR,
  NgControl,
  AbstractControl,
  UntypedFormControl, Validators
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MatFormFieldControl} from '@angular/material/form-field';

export class FoodNode {
  name: string = "";
  code: string = "";
  children?: FoodNode[];
}

export class ExampleFlatNode {
  expandable: boolean = false;
  name: string = "";
  level: number = 0;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    code: '',
    children: [
      {name: 'Apple', code: ''},
      {name: 'Banana', code: ''},
      {name: 'Fruit loops', code: ''},
    ]
  }, {
    name: 'Vegetables',
    code: '',
    children: [
      {
        name: 'Green',
        code: '',
        children: [
          {name: 'Broccoli', code: ''},
          {name: 'Brussels sprouts', code: ''},
        ]
      }, {
        name: 'Orange',
        code: '',
        children: [
          {name: 'Pumpkins', code: ''},
          {name: 'Carrots', code: ''},
        ]
      },
    ]
  },
];

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<FoodNode[]>([]);
  treeData: any = [];

  get data(): FoodNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {

    this.treeData = TREE_DATA;
    //this.treeData = this.convertTreeToList(TREE_DATA, []);
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    //const data = this.buildFileTree(TREE_DATA, '0');
    // Notify the change.
    this.dataChange.next(this.treeData);
  }

  convertTreeToList(nodes: any[], arr: any[]) {
    if (!nodes) {
      return [];
    }
    if (!arr) {
      arr = [];
    }
    for (var i = 0; i < nodes.length; i++) {
      arr.push(nodes[i]);
      this.convertTreeToList(nodes[i].children, arr);
    }
    return arr;
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */

  buildFileTree(obj: any[], level: string): FoodNode[] {
    return obj.filter(o =>
      (<string>o.code).startsWith(level + '.')
      && (o.code.match(/\./g) || []).length === (level.match(/\./g) || []).length + 1
    )
      .map(o => {
        const node = new FoodNode();
        node.name = o.text;
        node.code = o.code;
        const children = obj.filter(so => (<string>so.code).startsWith(level + '.'));
        if (children && children.length > 0) {
          node.children = this.buildFileTree(children, o.code);
        }
        return node;
      });
  }


  filterTree(array: any, text: any) {
    const getNodes = (result: any, object: any) => {
      if (object.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) > -1) {
        result.push(object);
        return result;
      }
      if (Array.isArray(object.children)) {
        const children = object.children.reduce(getNodes, []);
        if (children.length) result.push({...object, children});
      }
      return result;
    };
    return array.reduce(getNodes, []);
  }

  public filter(filterText: string) {
    let filteredTreeData: any;
    if (filterText) {
      filteredTreeData = this.filterTree(this.treeData, filterText)
    } else {
      filteredTreeData = this.treeData;
    }
    // Notify the change.
    this.dataChange.next(filteredTreeData);
  }
}

@Component({
  selector: 'app-material-tree-demo',
  templateUrl: './tree-autocomplete.component.html',
  styleUrls: ['./tree-autocomplete.component.css'],
  providers: [
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => MaterialTreeDemoComponent),
    //   multi: true
    // },
    ChecklistDatabase],

})
export class MaterialTreeDemoComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // /** FormControl para controlarse a sí mismo */
  formControlName: UntypedFormControl = new UntypedFormControl();
  // /* Controla si el componente es requerido */
  required: boolean = false;
  // /* Suscripciones que se ejecutan en nuestro componente */
  subscriptions: Subscription = new Subscription();
  selectedItem: any;
  /** Función para actualizar el valor del CVA */
  onChange = (_: any) => {  };
  /** Funcion para marcar como 'touched' el CVA */
  onTouch = () => {  };
  /** Controla si el componente está habilitado */
  isDisabled: boolean = false;
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  /* Validador que controla el valor recibido por nuestro control */
  isValidColor = (control: AbstractControl) => {

    if (control.value) {
      return {validColor: false};
    }

    return null;
  };

  constructor(
    @Self() private ngControl: NgControl,
    private database: ChecklistDatabase
  ) {
    this.ngControl.valueAccessor = this;
    this.dataSource.data = TREE_DATA;
    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  //getChildren = (node: FoodNode): FoodNode[] => node.children;

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  ngOnInit(): void {
    // Si el componente se está usando como control de un formulario
    if (this.ngControl) {
      this.formControlName = this.ngControl.control as UntypedFormControl;
    }
    // En caso contrario se inicializa el control del componente por defecto
    else {
      this.formControlName = new UntypedFormControl();
    }
    // Actualizamos el estado del componente
    this.updateState();
    // Listener para escuchar los cambios del FormControl externo
    this.subscriptions.add(
      this.formControlName.statusChanges.subscribe(() => {
        this.updateState();
      })
    );
  }

  ngOnDestroy(): void {
    // Eliminamos las suscripciones de los listeners guardados
    this.subscriptions.unsubscribe();
  }

  selectecionmattreenode(data: any) {
    this.selectedItem = data.name;
    this.showDropDown = false;
    this.onTouch();
    this.onChange(this.selectedItem);
  }

  showDropDown = false;

  filterChanged(filterText: any) {
    this.database.filter(filterText.target.value);
    if (filterText) {
      this.showDropDown = true;//
    } else {
      this.treeControl.collapseAll();
    }
  }

  writeValue(value: number): void {

    if (value) {
      this.selectedItem = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Se actualizan los validadores del componente
   */
  updateValidators(): void {

    const validators = this.formControlName.validator ? [this.formControlName.validator, this.isValidColor] : this.isValidColor;
    this.formControlName.setValidators(validators);
    this.formControlName.updateValueAndValidity({emitEvent: false});
  }

  /**
   * Comprueba si el componente está marcado como requerido
   * @returns Si el componente es requerido
   */
  isRequired(): boolean {
    if (this.formControlName?.validator) {
      const validator = this.formControlName.validator({} as AbstractControl);
      if (validator?.['required']) {
        return true;
      }
    }
    return false;
  }



  /**
   * Actualiza el estado del componente
   */
  updateState(): void {
    this.updateValidators();
    this.required = this.isRequired();
  }
}

