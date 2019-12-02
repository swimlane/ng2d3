# Pie Chart

## Pie Chart

{% embed data="{\"url\":\"https://embed.plnkr.co/BooZfKJz0nLATpTe1SwH?show=preview\",\"type\":\"rich\",\"title\":\"Pie Chart\",\"description\":\"Created on Plnkr: Helping developers build the web.\",\"icon\":{\"type\":\"icon\",\"url\":\"https://embed.plnkr.co/favicon.ico\",\"aspectRatio\":0},\"thumbnail\":{\"type\":\"thumbnail\",\"url\":\"https://shot.plnkr.co/BooZfKJz0nLATpTe1SwH.png?d=2017-03-31T15:14:32.802Z\",\"width\":400,\"height\":300,\"aspectRatio\":0.75},\"embed\":{\"type\":\"reader\",\"url\":\"https://embed.plnkr.co/plunk/BooZfKJz0nLATpTe1SwH?autoCloseSidebar&deferRun&show=preview\",\"html\":\"<div style=\\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 66.6667%;\\"><iframe src=\\"https://embed.plnkr.co/plunk/BooZfKJz0nLATpTe1SwH?autoCloseSidebar&amp;deferRun&amp;show=preview\\" style=\\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\\" allowfullscreen scrolling=\\"no\\"></iframe></div>\",\"aspectRatio\":1.5}}" %}

## Inputs

| Property        | Type        | Default Value | Description                                                                                                       |
| --------------- | ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| view            | number\[\]  |               | the dimensions of the chart \[width, height\]. If left undefined, the chart will fit to the parent container size |
| results         | object\[\]  |               | the chart data                                                                                                    |
| scheme          | object      |               | the color scheme of the chart                                                                                     |
| customColors    | object[]      |               | custom colors for the chart. Used to override a color for a specific value. Object with `name` and `value`                                        |
| animations      | boolean     | true          | enable animations                                                                                                 |
| labels          | boolean     | false         | show or hide the labels                                                                                           |
| labelFormatting | function    |               | function that formats the label text                                                                              |
| trimLabels      | boolean     | true          | trim the labels beyond a certain maximum length                                                                   |
| maxLabelLength  | number      | 10            | maximum length of the labels. If `trimLabels` is `true`, labels over this length will be trimmed                  |
| legend          | boolean     | false         | show or hide the legend                                                                                           |
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
