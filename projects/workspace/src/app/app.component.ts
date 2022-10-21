import {Component} from '@angular/core';
import { Variable, VariableGroup } from 'projects/ng-flowchart/src/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dataBucket = {} as any;

  visibleInstanceIndex = 0;

  sampleJson = {
  "root": {
    "id": "s1624206177187",
    "type": "log",
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
        "id": "s1624206178618",
        "type": "log",
        "data": {
          "name": "Log",
          "icon": {
            "name": "minus.svg",
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
            "type": "log",
            "data": {
              "name": "Log",
              "icon": {
                "name": "plus.svg",
                "color": "blue"
              },
              "config": {
                "message": null,
                "severity": null
              }
            },
            "children": []
          }
        ]
      }
    ]
  }
};

  variables = [
    {
      id: 'constants',
      name: 'ConstantsConstantsConstantsConstants',
      variables: [
        {
          id: 'Id1',
          name: 'Name 1ConstantsConstantsConstantsConstants',
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
    {
      id: 'sensors',
      name: 'Sensors',
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
    {
      id: 'kpis',
      name: 'KPIs',
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

  public onValueChange(source: string, value: object): void {
    this.dataBucket[source] = value;
    console.log('UPD', source, value);
  }
}
