import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule} from '@angular/material/checkbox';

import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  
  readonly maxTitleLength = 100;

  taskData = inject(MAT_DIALOG_DATA);

  isEdit: boolean;
  taskForm!: FormGroup;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) {
    this.isEdit = !!this.taskData;
    this.initialiseForm();
  }

  private initialiseForm(): void {
    this.taskForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(this.maxTitleLength), this.noWhitespaceValidator()]),
      completed: new FormControl(false)
    });

    if (this.isEdit) {
      this.taskForm.controls['title'].setValue(this.taskData.title);
      this.taskForm.controls['completed'].setValue(this.taskData.completed);
    }
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  createOrEditTask(): void {
    if (this.isEdit) {
      this.taskService.editTask(this.taskForm.value, this.taskData.id);
    }
    else {
      let task = this.taskForm.value;
      task.completed = false;
      this.taskService.createTask(task);
    }
  }

}
