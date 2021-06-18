import { data as countries } from 'emoji-flags';
import {
  SingleSeries,
  MultiSeries,
  BubbleChartMultiSeries,
  BoxChartMultiSeries,
  Series,
  TreeMapData
} from '@swimlane/ngx-charts/models/chart-data.model';

export const single: SingleSeries = [
  {
    name: 'Germany',
    value: 40632,
    extra: {
      code: 'de'
    }
  },
  {
    name: 'United States',
    value: 50000,
    extra: {
      code: 'us'
    }
  },
  {
    name: 'France',
    value: 36745,
    extra: {
      code: 'fr'
    }
  },
  {
    name: 'United Kingdom',
    value: 36240,
    extra: {
      code: 'uk'
    }
  },
  {
    name: 'Spain',
    value: 33000,
    extra: {
      code: 'es'
    }
  },
  {
    name: 'Italy',
    value: 35800,
    extra: {
      code: 'it'
    }
  }
];

export const multi: MultiSeries = [
  {
    name: 'Germany',
    series: [
      {
        name: '2010',
        value: 40632,
        extra: {
          code: 'de'
        }
      },
      {
        name: '2000',
        value: 36953,
        extra: {
          code: 'de'
        }
      },
      {
        name: '1990',
        value: 31476,
        extra: {
          code: 'de'
        }
      }
    ]
  },
  {
    name: 'United States',
    series: [
      {
        name: '2010',
        value: 0,
        extra: {
          code: 'us'
        }
      },
      {
        name: '2000',
        value: 45986,
        extra: {
          code: 'us'
        }
      },
      {
        name: '1990',
        value: 37060,
        extra: {
          code: 'us'
        }
      }
    ]
  },
  {
    name: 'France',
    series: [
      {
        name: '2010',
        value: 36745,
        extra: {
          code: 'fr'
        }
      },
      {
        name: '2000',
        value: 34774,
        extra: {
          code: 'fr'
        }
      },
      {
        name: '1990',
        value: 29476,
        extra: {
          code: 'fr'
        }
      }
    ]
  },
  {
    name: 'United Kingdom',
    series: [
      {
        name: '2010',
        value: 36240,
        extra: {
          code: 'uk'
        }
      },
      {
        name: '2000',
        value: 32543,
        extra: {
          code: 'uk'
        }
      },
      {
        name: '1990',
        value: 26424,
        extra: {
          code: 'uk'
        }
      }
    ]
  }
];

export const fiscalYearReport: MultiSeries = [
  {
    name: 'Q1',
    series: [
      {
        name: '1001',
        value: -10632
      },
      {
        name: '2001',
        value: -36953
      }
    ]
  },
  {
    name: 'Q2',
    series: [
      {
        name: '1001',
        value: -19737
      },
      {
        name: '2001',
        value: 45986
      }
    ]
  },
  {
    name: 'Q3',
    series: [
      {
        name: '1001',
        value: -16745
      },
      {
        name: '2001',
        value: 0
      }
    ]
  },
  {
    name: 'Q4',
    series: [
      {
        name: '1001',
        value: -16240
      },
      {
        name: '2001',
        value: 32543
      }
    ]
  }
];

export const bubble: BubbleChartMultiSeries = [
  {
    name: 'Germany',
    series: [
      {
        name: '2010',
        x: '2010',
        y: 80.3,
        r: 80.4
      },
      {
        name: '2000',
        x: '2000',
        y: 80.3,
        r: 78
      },
      {
        name: '1990',
        x: '1990',
        y: 75.4,
        r: 79
      }
    ]
  },
  {
    name: 'United States',
    series: [
      {
        name: '2010',
        x: '2010',
        y: 78.8,
        r: 310
      },
      {
        name: '2000',
        x: '2000',
        y: 76.9,
        r: 283
      },
      {
        name: '1990',
        x: '1990',
        y: 75.4,
        r: 253
      }
    ]
  },
  {
    name: 'France',
    series: [
      {
        name: '2010',
        x: '2010',
        y: 81.4,
        r: 63
      },
      {
        name: '2000',
        x: '2000',
        y: 79.1,
        r: 59.4
      },
      {
        name: '1990',
        x: '1990',
        y: 77.2,
        r: 56.9
      }
    ]
  },
  {
    name: 'United Kingdom',
    series: [
      {
        name: '2010',
        x: '2010',
        y: 80.2,
        r: 62.7
      },
      {
        name: '2000',
        x: '2000',
        y: 77.8,
        r: 58.9
      },
      {
        name: '1990',
        x: '1990',
        y: 75.7,
        r: 57.1
      }
    ]
  }
];

export const boxData: BoxChartMultiSeries = [
  {
    name: 'Colombia',
    series: [
      {
        name: '2019',
        value: 12
      },
      {
        name: '2020',
        value: 23
      },
      {
        name: '2021',
        value: 34
      },
      {
        name: '2022',
        value: 27
      },
      {
        name: '2023',
        value: 18
      },
      {
        name: '2024',
        value: 45
      }
    ]
  },
  {
    name: 'Chile',
    series: [
      {
        name: '2019',
        value: 20
      },
      {
        name: '2020',
        value: 28
      },
      {
        name: '2021',
        value: 42
      },
      {
        name: '2022',
        value: 39
      },
      {
        name: '2023',
        value: 31
      },
      {
        name: '2024',
        value: 61
      }
    ]
  },
  {
    name: 'Perú',
    series: [
      {
        name: '2019',
        value: 47
      },
      {
        name: '2020',
        value: 62
      },
      {
        name: '2021',
        value: 55
      },
      {
        name: '2022',
        value: 42
      },
      {
        name: '2023',
        value: 49
      },
      {
        name: '2024',
        value: 71
      }
    ]
  }
];

export function generateGraph(nodeCount: number) {
  const nodes = [];
  const links = [];
  for (let i = 0; i < nodeCount; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    nodes.push({
      value: country.name
    });
    for (let j = 0; j < nodes.length - 1; j++) {
      if (Math.random() < 0.03) {
        links.push({
          source: country,
          target: nodes[j].value
        });
      }
    }
  }
  return { links, nodes };
}

export function timelineFilterBarData(): SingleSeries {
  const results: SingleSeries = [];
  const dataPoints = 30;
  const dayLength = 24 * 60 * 60 * 1000;
  let date = 1473700105009; // Sep 12, 2016
  for (let j = 0; j < dataPoints; j++) {
    // random dates between Sep 12, 2016 and Sep 24, 2016
    results.push({
      name: new Date(date),
      value: Math.floor(Math.random() * 300)
    });
    date += dayLength;
  }
  if (!results.some(r => r.value === 0)) {
    results[Math.floor(Math.random() * results.length)].value = 0;
  }

  return results;
}

export function generateData(seriesLength: number, includeMinMaxRange: boolean, dataPoints: number = 5): MultiSeries {
  const results: MultiSeries = [];

  const domain: Date[] = []; // array of time stamps in milliseconds

  for (let j = 0; j < dataPoints; j++) {
    // random dates between Sep 12, 2016 and Sep 24, 2016
    domain.push(new Date(Math.floor(1473700105009 + Math.random() * 1000000000)));
  }

  for (let i = 0; i < seriesLength; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const series: Series = {
      name: country.name,
      series: []
    };

    for (let j = 0; j < domain.length; j++) {
      const value = Math.floor(2000 + Math.random() * 5000);
      // let timestamp = Math.floor(1473700105009 + Math.random() * 1000000000);
      const timestamp = domain[j];
      if (includeMinMaxRange) {
        const errorMargin = 0.02 + Math.random() * 0.08;

        series.series.push({
          value,
          name: timestamp,
          min: Math.floor(value * (1 - errorMargin)),
          max: Math.ceil(value * (1 + errorMargin))
        });
      } else {
        series.series.push({
          value,
          name: timestamp
        });
      }
    }

    results.push(series);
  }
  return results;
}

export const treemap: TreeMapData = [
  {
    name: 'flare',
    children: [
      {
        name: 'analytics',
        children: [
          {
            name: 'cluster',
            children: [
              { name: 'AgglomerativeCluster', size: 3938 },
              { name: 'CommunityStructure', size: 3812 },
              { name: 'HierarchicalCluster', size: 6714 },
              { name: 'MergeEdge', size: 743 }
            ]
          },
          {
            name: 'graph',
            children: [
              { name: 'BetweennessCentrality', size: 3534 },
              { name: 'LinkDistance', size: 5731 },
              { name: 'MaxFlowMinCut', size: 7840 },
              { name: 'ShortestPaths', size: 5914 },
              { name: 'SpanningTree', size: 3416 }
            ]
          },
          {
            name: 'optimization',
            children: [{ name: 'AspectRatioBanker', size: 7074 }]
          }
        ]
      },
      {
        name: 'animate',
        children: [
          { name: 'Easing', size: 17010 },
          { name: 'FunctionSequence', size: 5842 },
          {
            name: 'interpolate',
            children: [
              { name: 'ArrayInterpolator', size: 1983 },
              { name: 'ColorInterpolator', size: 2047 },
              { name: 'DateInterpolator', size: 1375 },
              { name: 'Interpolator', size: 8746 },
              { name: 'MatrixInterpolator', size: 2202 },
              { name: 'NumberInterpolator', size: 1382 },
              { name: 'ObjectInterpolator', size: 1629 },
              { name: 'PointInterpolator', size: 1675 },
              { name: 'RectangleInterpolator', size: 2042 }
            ]
          },
          { name: 'ISchedulable', size: 1041 },
          { name: 'Parallel', size: 5176 },
          { name: 'Pause', size: 449 },
          { name: 'Scheduler', size: 5593 },
          { name: 'Sequence', size: 5534 },
          { name: 'Transition', size: 9201 },
          { name: 'Transitioner', size: 19975 },
          { name: 'TransitionEvent', size: 1116 },
          { name: 'Tween', size: 6006 }
        ]
      },
      {
        name: 'data',
        children: [
          {
            name: 'converters',
            children: [
              { name: 'Converters', size: 721 },
              { name: 'DelimitedTextConverter', size: 4294 },
              { name: 'GraphMLConverter', size: 9800 },
              { name: 'IDataConverter', size: 1314 },
              { name: 'JSONConverter', size: 2220 }
            ]
          },
          { name: 'DataField', size: 1759 },
          { name: 'DataSchema', size: 2165 },
          { name: 'DataSet', size: 586 },
          { name: 'DataSource', size: 3331 },
          { name: 'DataTable', size: 772 },
          { name: 'DataUtil', size: 3322 }
        ]
      },
      {
        name: 'display',
        children: [
          { name: 'DirtySprite', size: 8833 },
          { name: 'LineSprite', size: 1732 },
          { name: 'RectSprite', size: 3623 },
          { name: 'TextSprite', size: 10066 }
        ]
      },
      {
        name: 'flex',
        children: [{ name: 'FlareVis', size: 4116 }]
      },
      {
        name: 'physics',
        children: [
          { name: 'DragForce', size: 1082 },
          { name: 'GravityForce', size: 1336 },
          { name: 'IForce', size: 319 },
          { name: 'NBodyForce', size: 10498 },
          { name: 'Particle', size: 2822 },
          { name: 'Simulation', size: 9983 },
          { name: 'Spring', size: 2213 },
          { name: 'SpringForce', size: 1681 }
        ]
      },
      {
        name: 'query',
        children: [
          { name: 'AggregateExpression', size: 1616 },
          { name: 'And', size: 1027 },
          { name: 'Arithmetic', size: 3891 },
          { name: 'Average', size: 891 },
          { name: 'BinaryExpression', size: 2893 },
          { name: 'Comparison', size: 5103 },
          { name: 'CompositeExpression', size: 3677 },
          { name: 'Count', size: 781 },
          { name: 'DateUtil', size: 4141 },
          { name: 'Distinct', size: 933 },
          { name: 'Expression', size: 5130 },
          { name: 'ExpressionIterator', size: 3617 },
          { name: 'Fn', size: 3240 },
          { name: 'If', size: 2732 },
          { name: 'IsA', size: 2039 },
          { name: 'Literal', size: 1214 },
          { name: 'Match', size: 3748 },
          { name: 'Maximum', size: 843 },
          {
            name: 'methods',
            children: [
              { name: 'add', size: 593 },
              { name: 'and', size: 330 },
              { name: 'average', size: 287 },
              { name: 'count', size: 277 },
              { name: 'distinct', size: 292 },
              { name: 'div', size: 595 },
              { name: 'eq', size: 594 },
              { name: 'fn', size: 460 },
              { name: 'gt', size: 603 },
              { name: 'gte', size: 625 },
              { name: 'iff', size: 748 },
              { name: 'isa', size: 461 },
              { name: 'lt', size: 597 },
              { name: 'lte', size: 619 },
              { name: 'max', size: 283 },
              { name: 'min', size: 283 },
              { name: 'mod', size: 591 },
              { name: 'mul', size: 603 },
              { name: 'neq', size: 599 },
              { name: 'not', size: 386 },
              { name: 'or', size: 323 },
              { name: 'orderby', size: 307 },
              { name: 'range', size: 772 },
              { name: 'select', size: 296 },
              { name: 'stddev', size: 363 },
              { name: 'sub', size: 600 },
              { name: 'sum', size: 280 },
              { name: 'update', size: 307 },
              { name: 'variance', size: 335 },
              { name: 'where', size: 299 },
              { name: 'xor', size: 354 },
              { name: '_', size: 264 }
            ]
          },
          { name: 'Minimum', size: 843 },
          { name: 'Not', size: 1554 },
          { name: 'Or', size: 970 },
          { name: 'Query', size: 13896 },
          { name: 'Range', size: 1594 },
          { name: 'StringUtil', size: 4130 },
          { name: 'Sum', size: 791 },
          { name: 'Variable', size: 1124 },
          { name: 'Variance', size: 1876 },
          { name: 'Xor', size: 1101 }
        ]
      },
      {
        name: 'scale',
        children: [
          { name: 'IScaleMap', size: 2105 },
          { name: 'LinearScale', size: 1316 },
          { name: 'LogScale', size: 3151 },
          { name: 'OrdinalScale', size: 3770 },
          { name: 'QuantileScale', size: 2435 },
          { name: 'QuantitativeScale', size: 4839 },
          { name: 'RootScale', size: 1756 },
          { name: 'Scale', size: 4268 },
          { name: 'ScaleType', size: 1821 },
          { name: 'TimeScale', size: 5833 }
        ]
      },
      {
        name: 'util',
        children: [
          { name: 'Arrays', size: 8258 },
          { name: 'Colors', size: 10001 },
          { name: 'Dates', size: 8217 },
          { name: 'Displays', size: 12555 },
          { name: 'Filter', size: 2324 },
          { name: 'Geometry', size: 10993 },
          {
            name: 'heap',
            children: [
              { name: 'FibonacciHeap', size: 9354 },
              { name: 'HeapNode', size: 1233 }
            ]
          },
          { name: 'IEvaluable', size: 335 },
          { name: 'IPredicate', size: 383 },
          { name: 'IValueProxy', size: 874 },
          {
            name: 'math',
            children: [
              { name: 'DenseMatrix', size: 3165 },
              { name: 'IMatrix', size: 2815 },
              { name: 'SparseMatrix', size: 3366 }
            ]
          },
          { name: 'Maths', size: 17705 },
          { name: 'Orientation', size: 1486 },
          {
            name: 'palette',
            children: [
              { name: 'ColorPalette', size: 6367 },
              { name: 'Palette', size: 1229 },
              { name: 'ShapePalette', size: 2059 },
              { name: 'SizePalette', size: 2291 }
            ]
          },
          { name: 'Property', size: 5559 },
          { name: 'Shapes', size: 19118 },
          { name: 'Sort', size: 6887 },
          { name: 'Stats', size: 6557 },
          { name: 'Strings', size: 22026 }
        ]
      },
      {
        name: 'vis',
        children: [
          {
            name: 'axis',
            children: [
              { name: 'Axes', size: 1302 },
              { name: 'Axis', size: 24593 },
              { name: 'AxisGridLine', size: 652 },
              { name: 'AxisLabel', size: 636 },
              { name: 'CartesianAxes', size: 6703 }
            ]
          },
          {
            name: 'controls',
            children: [
              { name: 'AnchorControl', size: 2138 },
              { name: 'ClickControl', size: 3824 },
              { name: 'Control', size: 1353 },
              { name: 'ControlList', size: 4665 },
              { name: 'DragControl', size: 2649 },
              { name: 'ExpandControl', size: 2832 },
              { name: 'HoverControl', size: 4896 },
              { name: 'IControl', size: 763 },
              { name: 'PanZoomControl', size: 5222 },
              { name: 'SelectionControl', size: 7862 },
              { name: 'TooltipControl', size: 8435 }
            ]
          },
          {
            name: 'data',
            children: [
              { name: 'Data', size: 20544 },
              { name: 'DataList', size: 19788 },
              { name: 'DataSprite', size: 10349 },
              { name: 'EdgeSprite', size: 3301 },
              { name: 'NodeSprite', size: 19382 },
              {
                name: 'render',
                children: [
                  { name: 'ArrowType', size: 698 },
                  { name: 'EdgeRenderer', size: 5569 },
                  { name: 'IRenderer', size: 353 },
                  { name: 'ShapeRenderer', size: 2247 }
                ]
              },
              { name: 'ScaleBinding', size: 11275 },
              { name: 'Tree', size: 7147 },
              { name: 'TreeBuilder', size: 9930 }
            ]
          },
          {
            name: 'events',
            children: [
              { name: 'DataEvent', size: 2313 },
              { name: 'SelectionEvent', size: 1880 },
              { name: 'TooltipEvent', size: 1701 },
              { name: 'VisualizationEvent', size: 1117 }
            ]
          },
          {
            name: 'legend',
            children: [
              { name: 'Legend', size: 20859 },
              { name: 'LegendItem', size: 4614 },
              { name: 'LegendRange', size: 10530 }
            ]
          },
          {
            name: 'operator',
            children: [
              {
                name: 'distortion',
                children: [
                  { name: 'BifocalDistortion', size: 4461 },
                  { name: 'Distortion', size: 6314 },
                  { name: 'FisheyeDistortion', size: 3444 }
                ]
              },
              {
                name: 'encoder',
                children: [
                  { name: 'ColorEncoder', size: 3179 },
                  { name: 'Encoder', size: 4060 },
                  { name: 'PropertyEncoder', size: 4138 },
                  { name: 'ShapeEncoder', size: 1690 },
                  { name: 'SizeEncoder', size: 1830 }
                ]
              },
              {
                name: 'filter',
                children: [
                  { name: 'FisheyeTreeFilter', size: 5219 },
                  { name: 'GraphDistanceFilter', size: 3165 },
                  { name: 'VisibilityFilter', size: 3509 }
                ]
              },
              { name: 'IOperator', size: 1286 },
              {
                name: 'label',
                children: [
                  { name: 'Labeler', size: 9956 },
                  { name: 'RadialLabeler', size: 3899 },
                  { name: 'StackedAreaLabeler', size: 3202 }
                ]
              },
              {
                name: 'layout',
                children: [
                  { name: 'AxisLayout', size: 6725 },
                  { name: 'BundledEdgeRouter', size: 3727 },
                  { name: 'CircleLayout', size: 9317 },
                  { name: 'CirclePackingLayout', size: 12003 },
                  { name: 'DendrogramLayout', size: 4853 },
                  { name: 'ForceDirectedLayout', size: 8411 },
                  { name: 'IcicleTreeLayout', size: 4864 },
                  { name: 'IndentedTreeLayout', size: 3174 },
                  { name: 'Layout', size: 7881 },
                  { name: 'NodeLinkTreeLayout', size: 12870 },
                  { name: 'PieLayout', size: 2728 },
                  { name: 'RadialTreeLayout', size: 12348 },
                  { name: 'RandomLayout', size: 870 },
                  { name: 'StackedAreaLayout', size: 9121 },
                  { name: 'TreeMapLayout', size: 9191 }
                ]
              },
              { name: 'Operator', size: 2490 },
              { name: 'OperatorList', size: 5248 },
              { name: 'OperatorSequence', size: 4190 },
              { name: 'OperatorSwitch', size: 2581 },
              { name: 'SortOperator', size: 2023 }
            ]
          },
          { name: 'Visualization', size: 16540 }
        ]
      }
    ]
  }
];
