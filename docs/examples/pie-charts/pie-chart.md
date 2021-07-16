# Pie Chart

## Pie Chart

{% embed data="{\"url\":\"https://stackblitz.com/edit/swimlane-pie-chart?embed=1&file=app/app.component.ts\",\"type\":\"link\",\"title\":\"pie-chart - StackBlitz\",\"description\":\"Pie Chart demo for ngx-charts\",\"icon\":{\"type\":\"icon\",\"url\":\"https://c.staticblitz.com/assets/icon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png\",\"aspectRatio\":0},\"thumbnail\":{\"type\":\"thumbnail\",\"url\":\"https://c.staticblitz.com/assets/icon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png\",\"aspectRatio\":0}}" %}

## Inputs

| Property        | Type        | Default Value | Description                                                                                                       |
| --------------- | ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| view            | number\[\]  |               | the dimensions of the chart \[width, height\]. If left undefined, the chart will fit to the parent container size |
| results         | object\[\]  |               | the chart data                                                                                                    |
| scheme          | object      |               | the color scheme of the chart                                                                                     |
| customColors    | object      |               | custom colors for the chart. Used to override a color for a specific value                                        |
| animations      | boolean     | true          | enable animations                                                                                                 |
| labels          | boolean     | false         | show or hide the labels                                                                                           |
| labelFormatting | function    |               | function that formats the label text                                                                              |
| trimLabels      | boolean     | true          | trim the labels beyond a certain maximum length                                                                   |
| maxLabelLength  | number      | 10            | maximum length of the labels. If `trimLabels` is `true`, labels over this length will be trimmed                  |
| labelMinArc     | number      | 6             | minimum arc length in degrees to display a label for each category                                                |
| legend          | boolean     | true         | show or hide the legend                                                                                           |
| legendTitle     | string      | 'Legend'      | the legend title                                                                                                  |
| legendPosition  | string      | 'right'       | the legend position ['right', 'below']                                                                            |
| explodeSlices   | boolean     | false         | make the radius of each slice proportional to it's value                                                          |
| doughnut        | boolean     | false         | should doughnut instead of pie slices                                                                             |
| arcWidth        | number      | 0.25          | arc width, expressed as a fraction of outer radius                                                                |
| gradient        | boolean     | false         | fill elements with a gradient instead of a solid color                                                            |
| activeEntries   | object\[\]  | \[\]          | elements to highlight                                                                                             |
| tooltipDisabled | boolean     | false         | show or hide the tooltip                                                                                          |
| tooltipText     | function    |               | a function that formats the tooltip                                                                               |
| tooltipTemplate | TemplateRef |               | a custom ng-template to be displayed inside the tooltip                                                           |

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
  }
]
```
