import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'serializer'
})
export class SerializerPipe implements PipeTransform {
  private amount: string = '';

  transform(value: any, args?: any): any {
    this.amount = '';
    if (!value) {
      return [];
    }

    return this.parsedChildTree(value.root);
  }

  parsedChildTree(rootNode) {
    if (rootNode.type === 'plus') {
      this.amount += ' +';
    }
    if (rootNode.type === 'minus') {
      this.amount += ' -';
    }
    if (rootNode.type === 'cross') {
      this.amount += ' *';
    }
    if (rootNode.type === 'divide') {
      this.amount += ' /';
    }
    if (rootNode.type === 'numeric') {
      this.amount += ' ' + rootNode.data;
    }
    if (rootNode.type === 'select') {
      this.amount += ' ' + rootNode.data.selectedOption.map(item => item.name);
    }
    if (rootNode.type === 'nested') {
      rootNode.data.nested.root && this.parsedChildTree(rootNode.data.nested.root);
    }
    if (!this._hasChildren(rootNode)) {
      return;
    }
    rootNode.children.forEach(child => {
      this.parsedChildTree(child);
    });
    return this.amount;
  }

  private _hasChildren(root: any) {
    return root.children && root.children.length > 0;
  }
}
