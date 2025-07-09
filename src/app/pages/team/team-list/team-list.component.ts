import { Component, NgModule, OnInit } from '@angular/core';
import { TeamService } from '../../service/team.service';
import { Team } from '../../service/team.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from "primeng/table";
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  providers: [ConfirmationService],
  imports: [TableModule]
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];

  constructor(
    private teamService: TeamService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getTeams().then(teams => {
      this.teams = teams;
    });
  }

  confirmDelete(teamId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este time?',
      accept: () => {
        this.teamService.deleteTeam(Number(teamId)).then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Time excluído com sucesso!'
          });
          this.loadTeams();
        });
      }
    });
  }
}

@NgModule({
  imports: [
    // ...outros módulos
    RouterModule // Adicione esta linha
  ],
  // ...declarações e providers
})
export class AppModule { }
