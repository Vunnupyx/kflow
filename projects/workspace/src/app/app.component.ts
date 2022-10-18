import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'workspace';

  hideItem1 = true;
  hideItem2 = true;
  hideItem3 = true;

  sampleJson = `{
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
}`;

  public showFlowData(value: any): void {
    console.log(value);
  }
}
