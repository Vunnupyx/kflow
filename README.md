# Angular flowchart

## General Idea

This project is our internal UI component. Very simple visual editor of expressions, based on dragging and dropping blocks.
To be used in our projects.

![Oct-05-2023 10-43-36](https://github.com/Vunnupyx/kflow/assets/53125611/d125fc5a-05b0-4e1d-96fb-ed08d9b0c951)


### Installation Instructions
1. Install it.
```
npm i @vunnupyx/kflow --registry=https://gitlab.com/api/v4/packages/npm/
```
2. Import it.
In your app module or module that contains your editor, import `KEditorModule`.

```
import { KEditorModule } from '@vunnupyx/kflow';

@NgModule({
  imports: [
    KEditorModule
  ]
})
export class AppModule { }

```
3. Add the <k-editor> tag to render the view.

```
<k-editor [value]="dataBucket[0] || sampleJson" [variables]="variables"> </k-editor>
```

### Options:

```javascript
sampleJson = {
    "root": {
        "id": "s1624206177187",
        "type": "numeric",
        "data": 2,
        "children": [
            {
                "id": "s1624206178618",
                "type": "cross",
                "data": {
                    "name": "Log",
                    "icon": {
                        "name": "cross.svg",
                        "color": "blue"
                    },
                    "config": {
                        "message": null,
                        "severity": null
                    }
                },
                "children": [
                    {
                        "id": "s1624206180286",
                        "type": "numeric",
                        "data": 2,
                        "children": []
                    }
                ]
            }
        ]
    }
}
variables = [
    {
        id: 'constants',
        name: 'Constants',
        variables: [
            {
                id: 'Id1',
                name: 'Name 1',
            } as Variable,
            {
                id: 'Id2',
                name: 'Name 2',
            } as Variable,
            {
                id: 'Id3',
                name: 'Name 3',
            } as Variable,
        ],
    } as VariableGroup,
];
```
