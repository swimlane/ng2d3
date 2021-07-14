import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  ElementRef,
  NgZone,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  PLATFORM_ID,
  Inject
} from '@angular/core';

import { fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VisibilityObserver } from '../utils/visibility-observer';
import { isDate } from '../utils/types';
import { ScaleType, ViewDimensions } from './types';
import { Color } from '../utils/color-sets';
import { CustomColor, CustomColorFn } from './color.helper';

@Component({
  selector: 'base-chart',
  template: ` <div></div> `
})
export class BaseChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() results: any;
  @Input() view: [number, number];
  @Input() scheme: string | Color = 'cool';
  @Input() schemeType: ScaleType = ScaleType.Ordinal;
  @Input() customColors: CustomColor[] | CustomColorFn;
  @Input() animations: boolean = true;

  @Output() select = new EventEmitter();

  width: number;
  height: number;
  resizeSubscription: Subscription;
  visibilityObserver: VisibilityObserver;

  constructor(
    protected chartElement: ElementRef,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) public platformId: any
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.animations = false;
    }
  }

  ngAfterViewInit(): void {
    this.bindWindowResizeEvent();

    // listen for visibility of the element for hidden by default scenario
    this.visibilityObserver = new VisibilityObserver(this.chartElement, this.zone);
    this.visibilityObserver.visible.subscribe(this.update.bind(this));
  }

  ngOnDestroy(): void {
    this.unbindEvents();
    if (this.visibilityObserver) {
      this.visibilityObserver.visible.unsubscribe();
      this.visibilityObserver.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    if (this.results) {
      this.results = this.cloneData(this.results);
    } else {
      this.results = [];
    }

    if (this.view) {
      this.width = this.view[0];
      this.height = this.view[1];
    } else {
      const dims = this.getContainerDims();
      if (dims) {
        this.width = dims.width;
        this.height = dims.height;
      }
    }

    // default values if width or height are 0 or undefined
    if (!this.width) {
      this.width = 600;
    }

    if (!this.height) {
      this.height = 400;
    }

    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);

    if (this.cd) {
      this.cd.markForCheck();
    }
  }

  getContainerDims(): ViewDimensions {
    let width;
    let height;
    const hostElem = this.chartElement.nativeElement;

    if (isPlatformBrowser(this.platformId) && hostElem.parentNode !== null) {
      // Get the container dimensions
      const dims = hostElem.parentNode.getBoundingClientRect();
      width = dims.width;
      height = dims.height;
    }

    if (width && height) {
      return { width, height };
    }

    return null;
  }

  /**
   * Converts all date objects that appear as name
   * into formatted date strings
   */
  formatDates(): void {
    for (let i = 0; i < this.results.length; i++) {
      const g = this.results[i];
      g.label = g.name;
      if (isDate(g.label)) {
        g.label = g.label.toLocaleDateString();
      }

      if (g.series) {
        for (let j = 0; j < g.series.length; j++) {
          const d = g.series[j];
          d.label = d.name;
          if (isDate(d.label)) {
            d.label = d.label.toLocaleDateString();
          }
        }
      }
    }
  }

  protected unbindEvents(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private bindWindowResizeEvent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const source = observableFromEvent(window, 'resize');
    const subscription = source.pipe(debounceTime(200)).subscribe(e => {
      this.update();
      if (this.cd) {
        this.cd.markForCheck();
      }
    });
    this.resizeSubscription = subscription;
  }

  /**
   * Clones the data into a new object
   *
   * @memberOf BaseChart
   */
  private cloneData(data): any {
    const results = [];

    for (const item of data) {
      const copy = {
        name: item['name']
      };

      if (item['value'] !== undefined) {
        copy['value'] = item['value'];
      }

      if (item['series'] !== undefined) {
        copy['series'] = [];
        for (const seriesItem of item['series']) {
          const seriesItemCopy = Object.assign({}, seriesItem);
          copy['series'].push(seriesItemCopy);
        }
      }

      if (item['extra'] !== undefined) {
        copy['extra'] = JSON.parse(JSON.stringify(item['extra']));
      }

      results.push(copy);
    }

    return results;
  }
}
