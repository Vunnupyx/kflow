import { Injectable } from '@angular/core';

@Injectable()
export class DeserializerService {
    private outerModel: any;
    private searchFormula: string[];
    private index: number;

    public deserialize(value: string): any {
        if (!value) {
            return this.outerModel;
        }
        this.searchFormula = value.split(' ');
        this.index = this.searchFormula.length;
        return { root: this.deserializeChildTree(this.outerModel) };
    }

    private deserializeChildTree(rootNode: any): any {
        this.index -= 1;

        if (this.searchFormula[this.index] === '+') {
            rootNode = {
                id: this.index,
                type: 'plus',
                data: {
                    name: 'Log',
                    icon: {
                        name: 'plus.svg',
                        color: 'blue'
                    },
                    config: {
                        message: null,
                        severity: null
                    }
                },
                children: rootNode ? [rootNode] : []
            };
        }

        if (this.searchFormula[this.index] === '-') {
            rootNode = {
                id: this.index,
                type: 'minus',
                data: {
                    name: 'Log',
                    icon: {
                        name: 'minus.svg',
                        color: 'blue'
                    },
                    config: {
                        message: null,
                        severity: null
                    }
                },
                children: rootNode ? [rootNode] : []
            };
        }
        if (this.searchFormula[this.index] === '*') {
            rootNode = {
                id: this.index,
                type: 'cross',
                data: {
                    name: 'Log',
                    icon: {
                        name: 'cross.svg',
                        color: 'blue'
                    },
                    config: {
                        message: null,
                        severity: null
                    }
                },
                children: rootNode ? [rootNode] : []
            };
        }

        if (this.searchFormula[this.index] === '/') {
            rootNode = {
                id: this.index,
                type: 'divide',
                data: {
                    name: 'Log',
                    icon: {
                        name: 'divide.svg',
                        color: 'blue'
                    },
                    config: {
                        message: null,
                        severity: null
                    }
                },
                children: rootNode ? [rootNode] : []
            };
        }

        if (this.isNumber(this.searchFormula[this.index])) {
            rootNode = {
                id: this.index,
                type: 'numeric',
                data: Number(this.searchFormula[this.index]),
                children: rootNode ? [rootNode] : []
            };
        }

        if (this.searchFormula[this.index] === '(') {
            return rootNode;
        }

        if (this.searchFormula[this.index] === ')') {
            rootNode = {
                id: this.index,
                type: 'nested',
                data: {
                    name: 'Nested Flow',
                    nested: {root: this.deserializeChildTree(undefined)}
                },
                children: rootNode ? [rootNode] : []
            };
        }

        if (this.index < 0) {
            return rootNode;
        }

        return this.deserializeChildTree(rootNode);
    }

    private isNumber(value: string | number): boolean {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    }
}
