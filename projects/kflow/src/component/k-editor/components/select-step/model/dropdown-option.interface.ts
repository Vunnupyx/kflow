export interface IDropdownOptions {
    id: string;
    name: string;
    variables?: IDropdownOptions[];
    parentId?: string;
    showSubmenu?: boolean;
}
