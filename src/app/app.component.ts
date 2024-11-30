import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatTabsModule} from '@angular/material/tabs';

import { TaskListComponent } from "./components/task-list/task-list.component";
import { ProgressChartComponent } from "./components/progress-chart/progress-chart.component";
import { Status, TaskService } from './services/task.service';


@Component({
  selector: 'app-root',
  imports: [TaskListComponent, ProgressChartComponent, CommonModule, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'esther-challenge';

  pageStatus!: string;
  status = Status;

  mobileLayout = false;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium']
  ]);

  constructor(
    private taskService: TaskService
  ) {
    this.taskService.getStatus$()
      .subscribe((status: string) => {
        this.pageStatus = status;
      });

      inject(BreakpointObserver)
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
        .subscribe(result => {
          this.mobileLayout = Object.values(result.breakpoints).includes(true);
        });
  }
}
