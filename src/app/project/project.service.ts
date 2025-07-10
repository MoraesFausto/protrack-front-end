import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Project, Task, TaskStatus } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects';

  constructor(private http: HttpClient) {}

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.getMockProject())) // Fallback para dados mockados
    );
  }

  private getMockProject(): Project {
    return {
      id: '1',
      name: 'Projeto Alpha',
      description: 'Projeto de desenvolvimento',
      tasks: [
        { id: '1', title: 'Criar layout', status: TaskStatus.COMPLETED },
        { id: '2', title: 'Implementar API', status: TaskStatus.IN_PROGRESS },
        { id: '3', title: 'Testes', status: TaskStatus.PENDING }
      ]
    };
  }
}