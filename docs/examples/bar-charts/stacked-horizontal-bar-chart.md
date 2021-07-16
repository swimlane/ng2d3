# Stacked Horizontal Bar Chart

## Stacked Horizontal Bar Chart

{% embed data="{\"url\":\"https://stackblitz.com/edit/swimlane-stacked-horizontal-bar-chart?embed=1&file=app/app.component.ts\",\"type\":\"link\",\"title\":\"stacked-horizontal-bar-chart - StackBlitz\",\"description\":\"Stacked Horizontal Bar Chart demo for ngx-charts\",\"icon\":{\"type\":\"icon\",\"url\":\"https://c.staticblitz.com/assets/icon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png\",\"aspectRatio\":0},\"thumbnail\":{\"type\":\"thumbnail\",\"url\":\"https://c.staticblitz.com/assets/icon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png\",\"aspectRatio\":0}}" %}

## Inputs

| Property            | Type               | Default Value | Description                                                                                                       |
| ------------------- | ------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| view                | number\[\]         |               | the dimensions of the chart \[width, height\]. If left undefined, the chart will fit to the parent container size |
| results             | object\[\]         |               | the chart data                                                                                                    |
| scheme              | object             |               | the color scheme of the chart                                                                                     |
| schemeType          | string             | 'ordinal'     | the color scale type. Can be either 'ordinal' or 'linear'                                                         |
| customColors        | function or object |               | custom colors for the chart. Used to override a color for a specific value                                        |
| animations          | boolean            | true          | enable animations                                                                                                 |
| legend              | boolean            | false         | show or hide the legend                                                                                           |
| legendTitle         | string             | 'Legend'      | the legend title                                                                                                  |
| legendPosition      | string             | 'right'       | the legend position ['right', 'below']                                                                            |
| xAxis               | boolean            | false         | show or hide the x axis                                                                                           |
| yAxis               | boolean            | false         | show or hide the y axis                                                                                           |
| showGridLines       | boolean            | true          | show or hide the grid lines                                                                                       |
| roundDomains        | boolean            | false         | round domains for aligned gridlines                                                                               |
| showXAxisLabel      | boolean            | false         | show or hide the x axis label                                                                                     |
| showYAxisLabel      | boolean            | false         | show or hide the y axis label                                                                                     |
| xAxisLabel          | string             |               | the x axis label text                                                                                             |
| yAxisLabel          | string             |               | the y axis label text                                                                                             |
| trimXAxisTicks      | boolean            | true          | trim or not ticks on the x axis                                                                                   |
| trimYAxisTicks      | boolean            | true          | trim or not ticks on the Y axis                                                                                   |
| rotateXAxisTicks    | boolean            | true          | enable automic rotation of x-axis ticks to prevent overlaps                                                       |
| maxXAxisTickLength  | number             | 16            | max length of the ticks. If `trimXAxisTicks` is `true`, ticks over this length will be trimmed                    |
| maxYAxisTickLength  | number             | 16            | max length of the ticks. If `trimYAxisTicks` is `true`, ticks over this length will be trimmed                    |
| xAxisTickFormatting | function           |               | the x axis tick formatting                                                                                        |
| yAxisTickFormatting | function           |               | the y axis tick formatting                                                                                        |
| yAxisTickMultiLine  | boolean            | false         | display ticks in multiple lines. The max characters by line will be the `maxYAxisTickLength` value                |
| xAxisTicks          | any\[\]            |               | predefined list of x axis tick values                                                                             |
| yAxisTicks          | any\[\]            |               | predefined list of y axis tick values                                                                             |
| noBarWhenZero       | boolean            | true          | hide bar if value is 0 and setting is true                                                                        |
| showDataLabel       | boolean            | false         | displays the value number next to the bar                                                                         |
| gradient            | boolean            | false         | fill elements with a gradient instead of a solid color                                                            |
| activeEntries       | object\[\]         | \[\]          | elements to highlight                                                                                             |
| barPadding          | number             | 8             | padding between bars in px                                                                                        |
| tooltipDisabled     | boolean            | false         | show or hide the tooltip                                                                                          |
| tooltipTemplate     | TemplateRef        |               | a custom ng-template to be displayed inside the tooltip                                                           |
| xScaleMax           | number             |               | the maximum value of the x axis \(ignored if chart data contains a higher value\)                                 |

## Outputs

| Property   | Description                                |
| ---------- | ------------------------------------------ |
| select     | click event                                |
| activate   | element activation event \(mouse enter\)   |
| deactivate | element deactivation event \(mouse leave\) |

## Data Format

The data format is multi series:

```text
[
  {
    "name": "Germany",
    "series": [
      {
        "name": "2010",
        "value": 7300000
      },
      {
        "name": "2011",
        "value": 8940000
      }
    ]
  },

  {
    "name": "USA",
    "series": [
      {
        "name": "2010",
        "value": 7870000
      },
      {
        "name": "2011",
        "value": 8270000
      }
    ]
  }
]
```
