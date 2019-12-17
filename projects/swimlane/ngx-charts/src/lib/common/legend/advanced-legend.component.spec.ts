import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ChartCommonModule } from '../chart-common.module';
import { ColorHelper, IColorSet } from '../color.helper';

@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent {
  legendLabel: string = 'Test legend label';
  colors: any;
  legendWidth: number;
  data: any;

  constructor() {
    const scheme: IColorSet = {
      name: 'test',
      group: 'Ordinal',
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    this.colors = new ColorHelper(scheme, 'ordinal', [], null);
    this.data = [
      { name: 'a', value: 8 },
      { name: 'b', value: 12 },
      { name: 'c', value: 20 },
      { name: 'd', value: 30 },
      { name: 'e', value: 46 },
      { name: 'f', value: 24 }
    ];
  }

  valueFormatting: (value: number) => any = value => value;
  labelFormatting: (value: string) => any = label => label;
  percentageFormatting: (value: number) => any = percentage => percentage;
}

describe('<ngx-charts-advanced-legend>', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ChartCommonModule]
    });

    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `
                <ngx-charts-advanced-legend
                  [label]="legendLabel"
                  [colors]="colors"
                  [data]="data"
                  [width]="legendWidth"
                  [animations]="false"
                  [valueFormatting]="valueFormatting"
                  [labelFormatting]="labelFormatting"
                  [percentageFormatting]="percentageFormatting">
                </ngx-charts-advanced-legend>
            `
      }
    });
  });

  it('should render label and legend with values for each item', async(() => {
    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const labelElement = fixture.debugElement.nativeElement.querySelector('.total-label');
      const roundedTotalElement = fixture.debugElement.nativeElement.querySelector('.advanced-pie-legend').children[0];
      const {
        legendItemsElements,
        legendItemValueElements,
        legendItemLabelElements,
        legendItemPercentElements
      } = loadLegendItemElements(fixture);

      expect(labelElement).toBeDefined();
      expect(roundedTotalElement).toBeDefined();

      expect(labelElement.textContent).toContain('Test legend label');
      expect(roundedTotalElement.textContent).toContain('140');
      expect(legendItemsElements.childElementCount).toBe(6);
      expect(Array.from(legendItemValueElements).map((x: Element) => x.textContent.trim())).toEqual([
        '8',
        '12',
        '20',
        '30',
        '46',
        '24'
      ]);
      expect(Array.from(legendItemLabelElements).map((x: Element) => x.textContent.trim())).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
        'f'
      ]);
      expect(Array.from(legendItemPercentElements).map((x: Element) => x.textContent.trim())).toEqual([
        '5.714%',
        '8.571%',
        '14.286%',
        '21.429%',
        '32.857%',
        '17.143%'
      ]);
    });
  }));

  it('should apply formatting functions', async(() => {
    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const component = fixture.componentInstance;
      component.valueFormatting = value => value.toFixed(2);
      component.labelFormatting = label => `X:${label}`;
      component.percentageFormatting = percentage => Math.round(percentage);
      fixture.detectChanges();

      const {
        legendItemsElements,
        legendItemValueElements,
        legendItemLabelElements,
        legendItemPercentElements
      } = loadLegendItemElements(fixture);

      expect(legendItemsElements.childElementCount).toBe(6);
      expect(Array.from(legendItemValueElements).map((x: Element) => x.textContent.trim())).toEqual([
        '8.00',
        '12.00',
        '20.00',
        '30.00',
        '46.00',
        '24.00'
      ]);
      expect(Array.from(legendItemLabelElements).map((x: Element) => x.textContent.trim())).toEqual([
        'X:a',
        'X:b',
        'X:c',
        'X:d',
        'X:e',
        'X:f'
      ]);
      expect(Array.from(legendItemPercentElements).map((x: Element) => x.textContent.trim())).toEqual([
        '6%',
        '9%',
        '14%',
        '21%',
        '33%',
        '17%'
      ]);
    });
  }));

  function loadLegendItemElements(fixture) {
    const legendItemsElements = fixture.debugElement.nativeElement.querySelector('.legend-items');
    const legendItemValueElements = fixture.debugElement.nativeElement.querySelectorAll('.legend-items .item-value');
    const legendItemLabelElements = fixture.debugElement.nativeElement.querySelectorAll('.legend-items .item-label');
    const legendItemPercentElements = fixture.debugElement.nativeElement.querySelectorAll(
      '.legend-items .item-percent'
    );
    return {
      legendItemsElements,
      legendItemValueElements,
      legendItemLabelElements,
      legendItemPercentElements
    };
  }
});
