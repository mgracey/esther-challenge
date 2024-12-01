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
        let completedTasks = tasks.filter(task => task.completed);
        completedTasks = this.sortByCompletionTime(completedTasks);
        this.prepareChartData(completedTasks);
      });
  }

  private prepareChartData(completedTasks: Task[]): void {
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

    this.setChartConfig(chartData, title);

  }

  private setChartConfig(chartData: any, title: string): void {
    this.chartOptions = {
      title: {
        text: title
      },
      tooltip: {
        formatter: function () {              
            return '<b>' + this.name + '</b><br>' + TimeTakenChartComponent.prototype.convertToTimeString(this.y || 0);
        }
      },
      series: [{
        name: 'Tasks',
        data: chartData,
        type: 'line'
      }],
      xAxis : {
        title: {
          text: 'Order of completion'
        },
        labels: {
          formatter: function() {
            let label = (typeof this.value === 'number') ? (this.value + 1).toString() : this.value;
            return label
          }
        }
      },
      yAxis : {
        title: {
          text: 'Time taken'
        },
        labels :{
          enabled: false
        }
      }
    };
  }

  private sortByCompletionTime(tasks: Task[]): Task[] {
    const sortedTasks = tasks.sort((a,b) => {
      let fieldA = a.dateCompleted || '';
      let fieldB = b.dateCompleted || '';

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
    
    return sortedTasks;
  }

    /*
    Times are measured in minutes so converting point these 
    times into more readable measurements for point tooltips
  */
    private convertToTimeString(mins: number): string{
      let timeString = [];
      let days = 0;
      let hours = 0;
  
      if (!mins) {
        return 'less than a minute';
      }
  
      //1440 mins in a day
      if ((mins / 1440) >= 1) {
        days = Math.floor(mins / 1440);
        mins = mins % 1440;
        timeString.push(days + (days === 1 ? ' day' : 'days'));
      }
  
      //60 mins in a hour
      if ((mins / 60) >= 1) {
        hours = Math.floor(mins / 60);
        mins = mins % 60;
        timeString.push(hours + 'h');
      }
  
      if (mins) {
        timeString.push(mins + 'm');
      }
  
      return timeString.join(',');
    }
}
