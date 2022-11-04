import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serializer'
})
export class SerializerPipe implements PipeTransform {
  private outerModel: string;

  transform(value: any): string {
    this.outerModel = '';
    if (!value || !value.root) {
      return this.outerModel;
    }
    return this.serializeChildTree(value.root);
  }

  serializeChildTree(rootNode: any): string {
    if (rootNode.type === 'plus') {
      this.outerModel += '+';
    }
    if (rootNode.type === 'minus') {
      this.outerModel += '-';
    }
    if (rootNode.type === 'cross') {
      this.outerModel += '*';
    }
    if (rootNode.type === 'divide') {
      this.outerModel += '/';
    }
    if (rootNode.type === 'numeric' && rootNode.data) {
      this.outerModel += rootNode.data;
    }
    if (rootNode.type === 'select' && rootNode.data.selectedOption) {
      this.outerModel += rootNode.data.selectedOption.map(item => item.name);
    }
    if (rootNode.type === 'nested' && rootNode.data.nested.root) {
        this.outerModel += '(';
        this.serializeChildTree(rootNode.data.nested.root);
        this.outerModel += ')';
    }
    if (!this._hasChildren(rootNode)) {
      return this.outerModel;
    }
    this.outerModel += ' ';
    rootNode.children.forEach(child => {
      this.serializeChildTree(child);
    });
    return this.outerModel;
  }

  private _hasChildren(root: any) {
    return root.children && root.children.length;
  }
}
