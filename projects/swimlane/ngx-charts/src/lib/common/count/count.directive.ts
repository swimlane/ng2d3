import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { count, decimalChecker } from './count.helper';

/**
 * Count up component
 *
 * Loosely inspired by:
 *  - https://github.com/izupet/angular2-counto
 *  - https://inorganik.github.io/countUp.js/
 *
 * @export
 */
@Component({
  selector: '[ngx-charts-count-up]',
  template: ` {{ value }} `
})
export class CountUpDirective implements OnDestroy {
  @Input() countDuration: number = 1;
  @Input() countPrefix: string = '';
  @Input() countSuffix: string = '';
  @Input() valueFormatting: any;

  @Input()
  set countDecimals(val: number) {
    this._countDecimals = val;
  }

  get countDecimals(): number {
    if (this._countDecimals) return this._countDecimals;
    return decimalChecker(this.countTo);
  }

  @Input()
  set countTo(val) {
    this._countTo = parseFloat(val);
    this.start();
  }

  get countTo(): any {
    return this._countTo;
  }

  @Input()
  set countFrom(val) {
    this._countFrom = parseFloat(val);
    this.start();
  }

  get countFrom(): any {
    return this._countFrom;
  }

  @Output() countChange = new EventEmitter();
  @Output() countFinish = new EventEmitter();

  nativeElement: any;

  value: any = '';
  formattedValue: string;

  private animationReq: any;

  private _countDecimals: number = 0;
  private _countTo: number = 0;
  private _countFrom: number = 0;

  constructor(private cd: ChangeDetectorRef, element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationReq);
  }

  start(): void {
    cancelAnimationFrame(this.animationReq);

    const valueFormatting =
      this.valueFormatting || (value => `${this.countPrefix}${value.toLocaleString()}${this.countSuffix}`);

    const callback = ({ value, progress, finished }) => {
      if (finished) {
        this.value = valueFormatting(this.countTo);
      } else {
        this.value = valueFormatting(value);
      }
      this.cd.markForCheck();
      if (!finished) this.countChange.emit({ value: this.value, progress });
      if (finished) this.countFinish.emit({ value: this.value, progress });
    };

    this.animationReq = count(this.countFrom, this.countTo, this.countDecimals, this.countDuration, callback);
  }
}
