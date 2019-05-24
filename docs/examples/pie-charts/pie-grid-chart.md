# Pie Grid Chart

## Pie Grid Chart

{% embed data="{\"url\":\"https://embed.plnkr.co/1wyoTPr38ajgzUmOhMHi?show=preview\",\"type\":\"rich\",\"title\":\"Pie Grid Chart\",\"description\":\"Created on Plnkr: Helping developers build the web.\",\"icon\":{\"type\":\"icon\",\"url\":\"https://embed.plnkr.co/favicon.ico\",\"aspectRatio\":0},\"thumbnail\":{\"type\":\"thumbnail\",\"url\":\"https://shot.plnkr.co/1wyoTPr38ajgzUmOhMHi.png?d=2018-05-15T15:57:46.908Z\",\"width\":400,\"height\":300,\"aspectRatio\":0.75},\"embed\":{\"type\":\"reader\",\"url\":\"https://embed.plnkr.co/plunk/1wyoTPr38ajgzUmOhMHi?autoCloseSidebar&deferRun&show=preview\",\"html\":\"<div style=\\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 66.6667%;\\"><iframe src=\\"https://embed.plnkr.co/plunk/1wyoTPr38ajgzUmOhMHi?autoCloseSidebar&amp;deferRun&amp;show=preview\\" style=\\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\\" allowfullscreen scrolling=\\"no\\"></iframe></div>\",\"aspectRatio\":1.5}}" %}



## Inputs

| Property | Type | Default Value | Description |
| --- | --- | --- | --- |
| view | number\[\] |  | the dimensions of the chart \[width, height\]. If left undefined, the chart will fit to the parent container size |
| results | object\[\] |  | the chart data |
| scheme | object |  | the color scheme of the chart |
| customColors | function or object |  | custom colors for the chart. Used to override a color for a specific value |
| animations | boolean | true | enable animations |
| label           | string             | 'Total'       | the text to show under the total value   
| hidePercentage  | boolean            | false         | hide percentage inside the pie grid
| hideSeriesLabel | boolean            | false         | hide series label inside the pie grid         
| tooltipDisabled | boolean | false | show or hide the tooltip |
| tooltipTemplate | TemplateRef |  | a custom ng-template to be displayed inside the tooltip |
| designatedTotal | number |  | total number that the value of each object in the results array will be compared to. If left undefined, the value of each object will automatically be compared to the total of all the values in the results array. |
| minWidth | number | 150 | minimum width of each graph in grid |

## Outputs

| Property | Description |
| --- | --- |
| select | click event |

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

