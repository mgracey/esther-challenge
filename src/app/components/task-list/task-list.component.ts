import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'

import { Task, TaskService } from '../../services/task.service';
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

  sortOptions = ['TitleAsc', 'TitleDesc', 'CreateAsc', 'CreateDesc'];
  selectedSort = this.sortOptions[0];

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) {
    this.taskService.getTasks$()
      .subscribe((tasks: Task[]) => {
        this.taskList = tasks;
      });
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