import {Component} from '@angular/core';

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
        "name": "log-icon",
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
            "name": "log-icon",
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
                "name": "log-icon",
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

  public onValueChange(source: string, value: object): void {
    this.dataBucket[source] = value;
    console.log('UPD', source, value);
  }
}
