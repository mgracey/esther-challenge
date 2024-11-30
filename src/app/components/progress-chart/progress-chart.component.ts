import { Component } from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-progress-chart',
  imports: [HighchartsChartModule],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.css'
})
export class ProgressChartComponent {
  totalCompleted = 0;
  totalIncomplete = 0;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private taskService: TaskService) {
    
    this.taskService.getTasks$()
      .subscribe((tasks: Task[]) => {
        this.totalCompleted = tasks.filter((x)=> x.completed).length;
        this.totalIncomplete = tasks.filter((x)=> !x.completed).length;

        let chartData: any;
        let title: string;

        if (this.totalCompleted || this.totalIncomplete) {
          title = 'Completed vs Incomplete';
          chartData = [
            {name: 'Completed', y:this.totalCompleted},
            {name: 'Incomplete', y:this.totalIncomplete}
          ];
          
        }
        else {
          title = 'No task data is currently present';
          chartData = [];
        }

        this.chartOptions = {
          title: {
            text: title
          },
          colors: [ "lightgreen", "#e34234"], 
          series: [{
            name: 'Tasks',
            data: chartData,
            type: 'pie'
          }]
        };
      });
  }
}
