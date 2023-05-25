// import { SelectionModel } from '@angular/cdk/collections';
// import { FlatTreeControl } from '@angular/cdk/tree';
// import { Component, Injectable } from '@angular/core';
// import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
// import { BehaviorSubject } from 'rxjs';
//
// /**
//  * Node for to-do item
//  */
// export class TreeItemNode {
//   children: TreeItemNode[] = [];
//   item!: string;
//   code!: string;
// }
//
// /** Flat to-do item node with expandable and level information */
// // export class TreeItemFlatNode {
// //   item!: string;
// //   level!: number;
// //   expandable!: boolean;
// //   code!: string;
// // }
//
// /**
//  * The Json object for to-do list data.
//  */
// const TREE_DATA = [
//   { 'text': 'Shield', 'code': '0.1' },
//   { 'text': 'Bill Management', 'code': '0.1.1' },
//   { 'text': 'Allow Bill Export Images', 'code': '0.1.1.1' },
//   { 'text': 'Unassigned Queue Access', 'code': '0.1.1.1' },
//   { 'text': 'Work Queue Access', 'code': '0.1.1.1' },
//
//   { 'text': 'Bill Management Actions', 'code': '0.1.2' },
//   { 'text': 'Allow Mark as Review Only', 'code': '0.1.2.1' },
//   { 'text': 'Allow Pay Code Edits', 'code': '0.1.2.1' },
//
//   { 'text': 'Claims', 'code': '0.1.3' },
//   { 'text': 'Allow Export: Bill Review Log', 'code': '0.1.3.1' },
//   { 'text': 'Allow Export: Claim History', 'code': '0.1.3.2' },
//   { 'text': 'Allow Export: Related Bill Summary', 'code': '0.1.3.3' },
//   { 'text': 'Claims Management', 'code': '0.1.3.4' },
//   { 'text': 'My Downloads', 'code': '0.1.3.5' }
//
// ];
//
// /**
//  * Checklist database, it can build a tree structured Json object.
//  * Each node in Json object represents a to-do item or a category.
//  * If a node is a category, it has children items and new items can be added under the category.
//  */
// @Injectable()
// export class ChecklistDatabase {
//   dataChange = new BehaviorSubject<TreeItemNode[]>([]);
//   treeData: any=[];
//   get data(): TreeItemNode[] { return this.dataChange.value; }
//
//   constructor() {
//     this.initialize();
//   }
//
//   initialize() {
//     this.treeData = TREE_DATA;
//     // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
//     //     file node as children.
//     const data = this.buildFileTree(TREE_DATA, '0');
//     // Notify the change.
//     this.dataChange.next(data);
//   }
//
//   /**
//    * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
//    * The return value is the list of `TodoItemNode`.
//    */
//
//   buildFileTree(obj: any[], level: string): TreeItemNode[] {
//     return obj.filter(o =>
//       (<string>o.code).startsWith(level + '.')
//       && (o.code.match(/\./g) || []).length === (level.match(/\./g) || []).length + 1
//     )
//       .map(o => {
//         const node = new TreeItemNode();
//         node.item = o.text;
//         node.code = o.code;
//         const children = obj.filter(so => (<string>so.code).startsWith(level + '.'));
//         if (children && children.length > 0) {
//           node.children = this.buildFileTree(children, o.code);
//         }
//         return node;
//       });
//   }
//
//   public filter(filterText: string) {
//     let filteredTreeData:any;
//     if (filterText) {
//       console.log(this.treeData);
//       filteredTreeData = this.treeData.filter((d:any) => d.text.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
//       Object.assign([], filteredTreeData).forEach((ftd:any) => {
//         let str = (<string>ftd.code);
//         while (str.lastIndexOf('.') > -1) {
//           const index = str.lastIndexOf('.');
//           str = str.substring(0, index);
//           if (filteredTreeData.findIndex((t:any) => t.code === str) === -1) {
//             const obj = this.treeData.find(d :any)=> d.code === str);
//             if (obj) {
//               filteredTreeData.push(obj);
//             }
//           }
//         }
//       });
//     } else {
//       filteredTreeData = this.treeData;
//     }
//
//     // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
//     // file node as children.
//     const data = this.buildFileTree(filteredTreeData, '0');
//     // Notify the change.
//     this.dataChange.next(data);
//   }
// }
