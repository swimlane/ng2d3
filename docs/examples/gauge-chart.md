# Gauge Chart

## Gauge

{% embed data="{\"url\":\"https://stackblitz.com/edit/swimlane-gauge-chart?embed=1&file=app/app.component.ts\",\"type\":\"link\",\"title\":\"gauge-chart - StackBlitz\",\"description\":\"Gauge Chart demo for ngx-charts\",\"icon\":{\"type\":\"icon\",\"url\":\"https://c.staticblitz.com/assets/icon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png\",\"aspectRatio\":0},\"thumbnail\":{\"type\":\"thumbnail\",\"url\":\"https://c.staticblitz.com/assets/icon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png\",\"aspectRatio\":0}}" %}

## Inputs

| Property           | Type               | Default Value | Description                                                                                                       |
| ------------------ | ------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| view               | number\[\]         |               | the dimensions of the chart \[width, height\]. If left undefined, the chart will fit to the parent container size |
| results            | object\[\]         |               | the chart data                                                                                                    |
| scheme             | object             |               | the color scheme of the chart                                                                                     |
| customColors       | function or object |               | custom colors for the chart. Used to override a color for a specific value                                        |
| animations         | boolean            | true          | enable animations                                                                                                 |
| legend             | boolean            | false         | show or hide the legend                                                                                           |
| legendTitle        | string             | 'Legend'      | the legend title                                                                                                  |
| min                | number             | 0             | starting point of the scale                                                                                       |
| max                | number             | 100           | ending point of the scale                                                                                         |
| units              | string             |               | text to display under the value                                                                                   |
| bigSegments        | number             | 10            | number of big segments on the axis                                                                                |
| smallSegments      | number             | 5             | number of small segments between every big segment                                                                |
| showAxis           | boolean            | true          | show or hide the axis                                                                                             |
| axisTickFormatting | function           |               | the axis tick formatting                                                                                          |
| valueFormatting    | function           |               | function that formats the value in the middle of the chart                                                        |
| angleSpan          | number             | 240           | the angle that the chart spans \(in degrees\)                                                                     |
| startAngle         | number             | -120          | the angle that the chart is rotated by. Use negative half of the spanning angle to centralize                     |
| tooltipDisabled    | boolean            | false         | show or hide the tooltip                                                                                          |
| tooltipTemplate    | TemplateRef        |               | a custom ng-template to be displayed inside the tooltip                                                           |
| showText           | boolean            | true          | show or hide the inner text                                                                                       |

## Outputs

| Property   | Description                                |
| ---------- | ------------------------------------------ |
| select     | click event                                |
| activate   | element activation event \(mouse enter\)   |
| deactivate | element deactivation event \(mouse leave\) |

## Data Format

The data format is single series:

```text
[
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "China",
    "value": 4000000,
    "extra": 
    {
      "startValue": 20000000 // this will create a range arc
    }
  }
]
```
