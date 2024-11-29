export interface Task {
  id: string,
  title: string;
  completed: boolean;
  dateCreated: string;
  dateCompleted?: string;
}

export interface TaskFragment {
  title?: string;
  completed?: boolean;
}

enum Endpoint {
  tasks = 'https://95nl7pkw84.execute-api.eu-west-1.amazonaws.com/esther-challenge/michael/tasks',
  task = 'https://95nl7pkw84.execute-api.eu-west-1.amazonaws.com/esther-challenge/michael/task/{taskID}'
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {
    this.retrieveTasks();
   }

  private taskListSubject = new BehaviorSubject<Task[]>([]);
  taskList$ = this.taskListSubject.asObservable();

  getTasks(): Task[] {
    return this.taskListSubject.getValue();
  }

  getTasks$(): Observable<Task[]> {
    return this.taskList$;
  }

  createTask(taskToAdd: Task) {
    this.http.post<string>(Endpoint.tasks, taskToAdd)
      .subscribe({
        next: idString => this.addTask(idString, taskToAdd),
        error: error => this.handleError(error)
      });
  }

  deleteTask(taskId: string) {
    this.http.delete(Endpoint.task.replace('{taskID}', taskId))
      .subscribe({
        next: () => this.removeTask(taskId),
        error: error => this.handleError(error)
      });
  }

  editTask(task: TaskFragment, id: string) {
    this.http.patch<string>(Endpoint.task.replace('{taskID}', id), task)
    .subscribe({
      next: () => this.updateTask(task, id),
      error: error => this.handleError(error)
    });
  }

  private retrieveTasks(): void {
    this.http.get<any>(Endpoint.tasks)
      .pipe(map(data => data.tasks))
      .subscribe({
        next: (tasks: Task[]) => this.setTasks(tasks),
        error: error => this.handleError(error)
      });
  }

  private setTasks(tasks: Task[]): void {
    this.taskListSubject.next(tasks);
  }

  private handleError(error: any): void {
    console.log(error); //TODO HANDLE THIS
  }

  /*
    Updating the internally saved taskList  so that we don't need
    to make another GET request after each update to get all the
    updated tasks. 
  */

  private addTask(taskId: string, task: Task) {
    let extractedID = taskId.match(/(^(?!.*ID\s)|(?<=ID\s)).*?((?=\sadded)|$)/);
    task.id = (extractedID && extractedID[0]) || '';
    task.dateCreated = new Date().toISOString();
    this.setTasks([...this.getTasks(), task]);
  }

  private removeTask(taskId: string): void {
    const filteredTasks = this.getTasks().filter(task => task.id !== taskId);
    this.setTasks(filteredTasks);
    console.log(this.getTasks());
  }

  private updateTask(updatedTask: TaskFragment, taskId: string): void {
    const tasks = this.getTasks();
    const updateIndex = tasks.findIndex(task => task.id === taskId);
    tasks[updateIndex] = Object.assign(tasks[updateIndex], updatedTask);

    if (tasks[updateIndex].completed && !tasks[updateIndex]?.dateCompleted) {
      tasks[updateIndex].dateCompleted = new Date().toISOString();
    }
    this.setTasks(tasks);
  }


}
