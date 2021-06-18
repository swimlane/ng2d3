# Box Chart

## Inputs

| Property        | Type                    | Default Value | Description                                                                                                                                                                                                     |
| --------------- | ----------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| view            | number\[\]              | [600, 400]    | The dimensions of the chart \[width, height\]. If left undefined, the chart will fit to the parent container size. Also, if one of the dimensions is zero or undefined, will fallback to the predefined values. |
| results         | BoxChartMultiSeries\[\] |               | The chart data. Please refer to the below data format section for more info.                                                                                                                                    |
| scheme          | string or object        |               | The color scheme of the chart. This accept either one of the color scheme enumerable string or an object with a domain property that contains an array of hex strings.                                          |
| schemeType      | string                  | 'ordinal'     | The color scale type. Can be either 'ordinal' or 'linear'.                                                                                                                                                      |  |
| customColors    | function or object      |               | Custom colors for the chart. Used to override a color for a specific value.                                                                                                                                     |
| animations      | boolean                 | true          | Enable animations.                                                                                                                                                                                              |
| legend          | boolean                 | false         | Show or hide the legend.                                                                                                                                                                                        |
| legendTitle     | string                  | 'Legend'      | The legend title.                                                                                                                                                                                               |
| legendPosition  | string                  | 'right'       | The legend position. Can be either 'right' or 'below'.                                                                                                                                                          |
| xAxis           | boolean                 | true          | Show or hide the x axis.                                                                                                                                                                                        |
| yAxis           | boolean                 | true          | Show or hide the y axis.                                                                                                                                                                                        |
| showGridLines   | boolean                 | true          | Show or hide the grid lines.                                                                                                                                                                                    |
| roundDomains    | boolean                 | false         | Round domains for aligned gridlines (Only for Y Axis).                                                                                                                                                          |
| showXAxisLabel  | boolean                 | true          | Show or hide the x axis label.                                                                                                                                                                                  |
| showYAxisLabel  | boolean                 | true          | Show or hide the y axis label.                                                                                                                                                                                  |
| xAxisLabel      | string                  |               | The x axis label text.                                                                                                                                                                                          |
| yAxisLabel      | string                  |               | The y axis label text.                                                                                                                                                                                          |
| tooltipDisabled | boolean                 | false         | Show or hide the tooltip                                                                                                                                                                                        |
| tooltipTemplate | TemplateRef             |               | Custom ng-template to be displayed inside the tooltip                                                                                                                                                           |
| roundEdges      | boolean                 | true          | Round edges for the boxes.                                                                                                                                                                                      |
| strokeColor     | string                  | '#FFFFFF'     | Stroke Color for the box lines. Must be a hex color string                                                                                                                                                      |
| strokeWidth     | number                  | 2             | Stroke Width for the box lines.                                                                                                                                                                                 |

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
