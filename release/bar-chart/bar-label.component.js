var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { formatLabel } from '..';
var BarLabelComponent = /** @class */ (function () {
    function BarLabelComponent() {
        this.leftPadding = 2;
        this.topPadding = 5;
    }
    BarLabelComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    BarLabelComponent.prototype.update = function () {
        this.formatedValue = formatLabel(this.value);
        if (this.orientation === 'horizontal') {
            this.x = this.barX + this.barWidth + this.leftPadding;
            this.y = this.barY + this.barHeight / 2;
        }
        else {
            // orientation must be "vertical"      
            this.x = this.barX + this.barWidth / 4;
            this.y = this.barY + this.barHeight - this.topPadding;
            this.transform = "rotate(-45, " + this.x + " , " + this.y + ")";
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarLabelComponent.prototype, "value", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarLabelComponent.prototype, "barX", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarLabelComponent.prototype, "barY", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarLabelComponent.prototype, "barWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarLabelComponent.prototype, "barHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarLabelComponent.prototype, "orientation", void 0);
    BarLabelComponent = __decorate([
        Component({
            selector: 'g[ngx-charts-bar-label]',
            template: "  \n    <svg:text   \n      font-size=\"12px\" \n      alignment-baseline=\"middle\"     \n      [attr.transform]=\"transform\"\n      [attr.x]=\"x\" \n      [attr.y]=\"y\">\n      {{formatedValue}}     \n    </svg:text>          \n\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], BarLabelComponent);
    return BarLabelComponent;
}());
export { BarLabelComponent };
//# sourceMappingURL=bar-label.component.js.map