import { Component, Input, OnChanges } from '@angular/core';
// Verifique o caminho correto conforme sua estrutura
import { Project, TaskStatus } from '@app/project/project.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnChanges {
  @Input() project!: Project;
  progress = 0;
  completedTasks = 0;
  totalTasks = 0;

  ngOnChanges(): void {
    this.calculateProgress();
  }

  calculateProgress(): void {
    if (!this.project?.tasks?.length) {
      this.progress = 0;
      return;
    }

    this.totalTasks = this.project.tasks.length;
    this.completedTasks = this.project.tasks.filter(
      task => task.status === TaskStatus.COMPLETED
    ).length;

    this.progress = Math.round((this.completedTasks / this.totalTasks) * 100);
  }
}