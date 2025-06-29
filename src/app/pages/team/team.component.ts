/* team.component.ts */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Team, TeamService, TeamEmployeeDTO } from '../service/team.service';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

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
    teams: Team[] = [];
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

    onEdit(team: Team) {
        this.router.navigate(['/pages/manage-team', team.id]);
    }

    onDelete(team: Team) {
        this.teamService.deleteTeam(team.id).then(() => {
            this.teams = this.teams.filter((t) => t.id !== team.id);
            delete this.selectedMembers[team.id];
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
