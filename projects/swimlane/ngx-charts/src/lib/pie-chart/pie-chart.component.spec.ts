import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { arc } from 'd3-shape';

import { single } from '../../../../../../src/app/data';
import { APP_BASE_HREF } from '@angular/common';

import { PieChartModule } from './pie-chart.module';
import { InjectionService } from '../common/tooltip/injection.service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent {
  single: any = single;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
}

describe('<ngx-charts-pie>', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, PieChartModule],
      providers: [
        {
          provide: InjectionService,
          useValue: {
            appendComponent: () => {
              // noop
            }
          }
        },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  describe('basic setup', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <ngx-charts-pie-chart
              [animations]="false"
              [results]="single"
              [view]="[400,800]"
              [scheme]="colorScheme"
              [doughnut]="false"
              [sliceBorderColor]="'white'"
              [sliceBorderWidth]="4">
            </ngx-charts-pie-chart>`
        }
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should set the svg width and height', () => {
      const svg = fixture.debugElement.nativeElement.querySelector('svg');

      expect(svg.getAttribute('width')).toBe('400');
      expect(svg.getAttribute('height')).toBe('800');
    });

    it('should render 6 arc elements', () => {
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelectorAll('path.arc').length).toEqual(6);
    });

    it('should render an arc', () => {
      const arcElement = fixture.debugElement.nativeElement.querySelector('path.arc');

      const testArc: any = arc().innerRadius(0).outerRadius(180).startAngle(0).endAngle(1.0984497063524654);

      expect(arcElement.getAttribute('d')).toEqual(testArc());
    });
    it('should render white border to arc', () => {
      const arcElement = fixture.debugElement.nativeElement.querySelector('path.arc');
      expect(arcElement.getAttribute('stroke')).toEqual('white');
      expect(arcElement.getAttribute('stroke-width')).toEqual('4');
    });
  });

  describe('doughnut', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <ngx-charts-pie-chart
              [animations]="false"
              [results]="single"
              [view]="[400,800]"
              [scheme]="colorScheme"
              [doughnut]="true">
            </ngx-charts-pie-chart>`
        }
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should render an arc, default width', () => {
      const arcElement = fixture.debugElement.nativeElement.querySelector('path.arc');
      const outerRadius = 180;

      const testArc: any = arc()
        .innerRadius((outerRadius * 3) / 4) // default arc is 1/4 outerwidth
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(1.0984497063524654);

      expect(arcElement.getAttribute('d')).toEqual(testArc());
    });
  });

  describe('doughnut, arc', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <ngx-charts-pie-chart
            [animations]="false"
            [results]="single"
            [view]="[400,800]"
            [scheme]="colorScheme"
            [doughnut]="true"
            [arcWidth]="0.1">
          </ngx-charts-pie-chart>`
        }
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should render an arc, set width', () => {
      const arcElement = fixture.debugElement.nativeElement.querySelector('path.arc');
      const outerRadius = 180;

      const testArc: any = arc()
        .innerRadius(outerRadius * 0.9) // default arc is 1/4 outerwidth
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(1.0984497063524654);

      expect(arcElement.getAttribute('d')).toEqual(testArc());
    });
  });
});
