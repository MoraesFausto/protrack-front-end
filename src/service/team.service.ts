import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:3000/api/teams';

  constructor(private http: HttpClient) { }

  // Criar time
  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  // Atualizar time
  updateTeam(id: string, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
  }

  // Excluir time
  deleteTeam(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Associar funcionário a uma equipe
  addEmployeeToTeam(teamId: string, employeeId: string): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/employees`, { employeeId });
  }

  // Remover funcionário de uma equipe
  removeEmployeeFromTeam(teamId: string, employeeId: string): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/employees/${employeeId}`);
  }
}