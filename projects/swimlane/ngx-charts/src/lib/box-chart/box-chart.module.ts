import { NgModule } from '@angular/core';
import { ChartCommonModule } from '../common/chart-common.module';
import { BoxChartComponent } from './box-chart.component';
import { BoxSeriesComponent } from './box-series.component';
import { BoxComponent } from './box.component';

@NgModule({
  imports: [ChartCommonModule],
  declarations: [BoxChartComponent, BoxSeriesComponent, BoxComponent],
  exports: [BoxChartComponent, BoxSeriesComponent, BoxComponent]
})
export class BoxChartModule {}
