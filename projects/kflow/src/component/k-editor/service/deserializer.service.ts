import { Injectable } from '@angular/core';
import { Variable, VariableGroup } from '../../../models';

@Injectable()
export class DeserializerService {
    private selectableOptions: VariableGroup[];
    private searchFormula: string[];
    private index: number;

    public deserialize(value: string, variables: VariableGroup[]): any {
        if (!value) {
            return;
        }

        this.selectableOptions = variables;
        this.searchFormula = value.split(' ');
        this.index = this.searchFormula.length;

        return {root: this.deserializeChildTree(undefined)};
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
        } else if (this.searchFormula[this.index] === '-') {
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
        } else if (this.searchFormula[this.index] === '*') {
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
        } else if (this.searchFormula[this.index] === '/') {
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
        } else if (this.searchFormula[this.index] === '%') {
            rootNode = {
                id: this.index,
                type: 'percent',
                data: {
                    name: 'Log',
                    icon: {
                        name: 'percent.svg',
                        color: 'blue'
                    },
                    config: {
                        message: null,
                        severity: null
                    }
                },
                children: rootNode ? [rootNode] : []
            };
        } else if (this.isNumber(this.searchFormula[this.index])) {
            rootNode = {
                id: this.index,
                type: 'numeric',
                data: Number(this.searchFormula[this.index]),
                children: rootNode ? [rootNode] : []
            };
        } else if (this.searchFormula[this.index] === '(') {
            return rootNode;
        } else if (this.searchFormula[this.index] === ')') {
            rootNode = {
                id: this.index,
                type: 'nested',
                data: {
                    name: 'Nested Flow',
                    nested: {root: this.deserializeChildTree(undefined)}
                },
                children: rootNode ? [rootNode] : []
            };
        } else if (this.selectableOptions && this.searchFormula[this.index]) {
            const searchOption = this.searchFormula[this.index].split('/');
            let selectedOption = [];
            searchOption.forEach((opt) => {
                const optionSearchResult = selectedOption.length ? this.searchOpt(opt, selectedOption[0].variables) : this.searchOpt(opt, this.selectableOptions);
                optionSearchResult && selectedOption.push(optionSearchResult);
            });
            if (selectedOption) {
                rootNode = {
                    id: this.index,
                    type: 'select',
                    data: {
                        selectedOption: selectedOption,
                        dropdownOptions: this.selectableOptions
                    },
                    children: rootNode ? [rootNode] : []
                };
            }
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

    private searchOpt(selectedOption: string, variables: VariableGroup[] | Variable[]) {
        return variables.find((variable) => (variable.name === selectedOption));
    }
}
