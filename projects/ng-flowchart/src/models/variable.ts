export interface Variable {
    id: string;
    name: string;
}

export interface VariableGroup {
    id: string;
    name: string;
    variables: Variable[];
}
