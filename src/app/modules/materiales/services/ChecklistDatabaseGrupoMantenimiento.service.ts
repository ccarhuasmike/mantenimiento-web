import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {FoodNode} from "@shared/components/tree-autocomplete/tree-autocomplete.component";

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabaseGrupoMantenimiento {
  dataChange = new BehaviorSubject<FoodNode[]>([]);
  treeData: any = [];

  get data(): FoodNode[] {
    return this.dataChange.value;
  }
  constructor() {
    this.initialize();
  }
  initialize() {
    //this.treeData = TREE_DATA;
    // Notify the change.
    const data = this.treeData;
    this.dataChange.next(data );
  }
  public filter(filterText: string) {

    let filteredTreeData;
    if (filterText) {
      // Filter the tree
      function filter(array:[], text:string) {
        const getChildren = (result:any, object:any) => {
          if (object.label.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) > -1) {
            result.push(object);
            return result;
          }
          if (Array.isArray(object.children)) {
            const children = object.children.reduce(getChildren, []);
            if (children.length) result.push({ ...object, children });
          }
          return result;
        };
        return array.reduce(getChildren, []);
      }

      filteredTreeData = filter(this.treeData, filterText);
    } else {
      // Return the initial tree
      filteredTreeData = this.treeData;
    }

    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    const data = filteredTreeData;
    // Notify the change.
    this.dataChange.next(data);
  }
}
