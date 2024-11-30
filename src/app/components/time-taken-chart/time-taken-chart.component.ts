import { Component } from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-time-taken-chart',
  imports: [HighchartsChartModule],
  templateUrl: './time-taken-chart.component.html',
  styleUrl: './time-taken-chart.component.css'
})
export class TimeTakenChartComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private taskService: TaskService) {
    
    this.taskService.getTasks$()
      .subscribe((tasks: Task[]) => {
        const completedTasks = tasks.filter(task => task.completed);

        let chartData: any = [];
        let title: string; 

        if (completedTasks.length) {
          title = "Task completion times";

          for(let task of completedTasks) {
            let createDate = new Date(task.dateCreated).getTime();
            let completeDate = new Date(task.dateCompleted || '').getTime();
  
            const takenMins = (completeDate - createDate) / (1000 * 60);
            chartData.push([task.title, Math.round(takenMins)])
          }
        }
        else {
          title = "No completed task data is currently present"; 
        }

        this.chartOptions = {
          title: {
            text: title
          },
          series: [{
            name: 'Time taken (in mins)',
            data: chartData,
            type: 'line'
          }],
          xAxis : {
            labels :{
              enabled: false
            }
          },
          yAxis : {
            title: {
              text: 'Time (in mins)'
            }
          }
        };
      });
  }
}
