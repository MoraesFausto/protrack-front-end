/* team.component.ts */
import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Team as ServiceTeam, TeamService, TeamEmployeeDTO } from '../service/team.service';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { AppComponent } from '../../../app.component';
import { BrowserModule } from '@angular/platform-browser';

  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule
  ]



@Component({
    selector: 'app-team-table',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, MultiSelectModule, IconFieldModule, InputIconModule, TagModule],
    templateUrl: './team.component.html',
    styles: [
        `
            .member-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem; /* aumentei o gap entre as tags */
            }
            .member-tags ::ng-deep .p-tag {
                margin: 0.25rem 0; /* margem vertical para espaçamento extra */
            }
        `
    ],
    providers: [TeamService]
})
export class TeamComponent implements OnInit {
    teams: ServiceTeam[] = [];
    loading: boolean = true;
    selectedMembers: { [teamId: number]: TeamEmployeeDTO[] } = {};

    constructor(
        private teamService: TeamService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadTeams();
    }

    private async loadTeams() {
        this.teams = await this.teamService.getTeams();
        // initialize selectedMembers for each team to display chips
        this.teams.forEach((team) => {
            this.selectedMembers[team.id] = [...team.teamEmployees];
        });
        this.loading = false;
    }

    onAdd() {
        this.router.navigate(['/pages/manage-team', 'new']);
    }

    onEdit(team: ServiceTeam) {
        this.router.navigate(['/pages/manage-team', team.id]);
    }

    onDelete(team: ServiceTeam) {
        this.teamService.deleteTeam(team.id).then(() => {
            this.teams = this.teams.filter((t) => t.id !== team.id);
            delete this.selectedMembers[team.id];
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

@NgModule({
  declarations: [

    // outros componentes como TeamListComponent, TeamMembersComponent, etc.
  ],
  imports: [
     AppComponent,
    TeamFormComponent,
    BrowserModule,
    ReactiveFormsModule, // ✅ ESSENCIAL para funcionar o [formGroup]
    // outros módulos como AppRoutingModule etc.
  ],
  bootstrap: []
})
export class AppModule {}

export interface Team {
  id: string;
  name: string;
  employees: string[]; }// IDs dos funcionários do time
  // outras propriedades




/* import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
``````typescript
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule
  ],*/



  /* import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamFormComponent } from './team-form.component';
``````typescript
@NgModule({
  declarations: [
    TeamFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class TeamFormModule { }*/



/*import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list.component';
import { TableModule } from 'primeng/table'; // <-- Import TableModule
// other imports

@NgModule({
  declarations: [TeamListComponent],
  imports: [
    CommonModule,
    TableModule, // <-- Add TableModule here
    // other modules
  ],
  providers: []
})
export class TeamListModule { } */
