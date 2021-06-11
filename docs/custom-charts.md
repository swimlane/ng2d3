# Custom Charts

Other than the library of available charts, ngx-charts also exports all of the components and helpers used as building blocks for the charts. Things like legends, axes, dimension helpers, gradients, shapes, series of shapes, can all be directly imported into your application and used in your components. This allows you to combine them and build custom charts that implement use cases that the pre-made charts do not support.

You can find an example of how to use these components to build a custom chart here: [https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/combo-chart](https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/combo-chart)

The demo of the above combo-chart can be seen here: [https://swimlane.github.io/ngx-charts/\#/ngx-charts/combo-chart](https://swimlane.github.io/ngx-charts/#/ngx-charts/combo-chart)

The charts under the 'Demos' group in our demo page are not distributed with the library. However, their code is available and can be copied directly into your project. We encourage you to submit a pull request for your custom charts to be listed in our 'Demos' section, because they may help other people that have the same use case as you.

## Custom Chart Index

- [Bar/Line Combo Chart](https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/combo-chart)
- [Sparkline](https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/sparkline)
- [Timeline filter bar chart](https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/timeline-filter-bar-chart)
- [Bubble Chart Interactive Drilldown](https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/bubble-chart-interactive)
- [Double Line Chart](https://github.com/swimlane/ngx-charts/tree/master/src/app/custom-charts/double-line-chart)

_If you want to have your custom chart featured above, please submit a pull request to_ [_this file_](https://github.com/swimlane/ngx-charts/blob/master/docs/custom-charts.md)_._

## Pointers when creating or adapting Custom Charts

- To develop new charts, start by building the shell in the demo project first.
- If you start by copying an existing chart from src (recommended), be sure to rename your new component(s) and their selectors, as well as the module that contains them (if applicable).
- If you discover the tooltip does not display correctly, try exporting the new chart as a module along with ChartCommonModule and import it into the demo's app.module.ts file.
- For an example of this, look at most any chart in the src folder
- Always a good idea to give back. Use this link to learn how to contribute to github repos: http://kbroman.org/github_tutorial/pages/fork.html
