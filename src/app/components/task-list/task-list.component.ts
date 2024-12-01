import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'

import { Task, TaskService, Status } from '../../services/task.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  
  taskList!: Task[];
  pageStatus!: string;
  status = Status;

  sortOptions = ['Title (Ascending)', 'Title (Desending)', 'Create (Ascending)', 'Create (Desending)'];
  selectedSort = this.sortOptions[0];

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) {
    this.taskService.getTasks$()
      .subscribe((tasks: Task[]) => {
        tasks = this.sort(tasks);
        this.taskList = tasks;
      });
  }

  applySort(): void {
    this.taskList = this.sort(this.taskList);
  }

  sort(tasks: Task[]): Task[] {
    switch(this.selectedSort) {
      case this.sortOptions[1]:
        return this.sortFn(tasks, 'title', true);
        break;
      case this.sortOptions[2]:
        return this.sortFn(tasks, 'dateCreated', false);
        break;
      case this.sortOptions[3]:
        return this.sortFn(tasks, 'dateCreated', true);
        break;
      default: 
        return this.sortFn(tasks, 'title', false);
    }
  }

  sortFn(tasks: Task[], sortField: string, isDescending: boolean): Task[] {
    const sortedTasks = tasks.sort((a,b) => {
      let fieldA = a[sortField as keyof Task] || '';
      let fieldB = b[sortField as keyof Task] || '';

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });

    return isDescending ? sortedTasks.reverse(): sortedTasks;
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  completeTask(taskId: string): void {
    this.taskService.editTask({completed: true}, taskId);
  }

  openModal(task?: Task): void {
    this.dialog.open(TaskModalComponent, {
      data: task,
      width: '60vw',
      height: '280px'
    });
  }
}