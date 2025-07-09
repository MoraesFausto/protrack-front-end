import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { firstValueFrom } from 'rxjs';
import { Employee } from './employee.service';

export interface TeamDTO {
    id: number;
    name: string;
    teamFocus: string;
    employees: TeamEmployeeDTO[];
}

export interface TeamEmployeeDTO {
    id: number;
    name: string;
}

export interface CreateTeamDTO {
    name: string;
    email: string;
    employees: TeamEmployeeDTO[];
}

export interface TeamEmployeeDTO {
    id: number;
    name: string;
}
//
export interface Team {

    id: number;
    name: string;
    teamFocus?: string;
    teamEmployees: TeamEmployeeDTO[];
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    constructor(private apiService: APIService) {}

    async getTeamById(id: string): Promise<Team | null> {
        const teamData = await this.apiService.get<TeamDTO>(`team/${id}`).toPromise();
        if (!teamData) {
            return null;
        }
        return {
            id: teamData.id,
            name: teamData.name,
            teamFocus: teamData.teamFocus,
            teamEmployees: teamData.employees
        };
    }

    async getTeams(): Promise<Team[]> {
        const tamsData: Team[] = [];
        await this.apiService.get<TeamDTO[]>('teams').subscribe((data) =>
            data.forEach((teamData) => {
                console.log(teamData);
                const team: Team = {
                    id: teamData.id,
                    name: teamData.name,
                    teamFocus: teamData.teamFocus,
                    teamEmployees: teamData.employees
                };
                tamsData.push(team);
            })
        );
        return tamsData;
    }

    async createTeam(team: CreateTeamDTO): Promise<Team> {
        try {
            if (!team.name || !team.employees || team.employees.length === 0) {
                throw new Error('Name, email, and role are required to create a team.');
            }
            console.log('Creating team:', team);
            const data = await firstValueFrom(this.apiService.post<TeamDTO>('employees', team));
            return {
                id: data.id,
                name: data.name,
                teamFocus: data.teamFocus,
                teamEmployees: data.employees
            } as Team;
        } catch (error) {
            console.error('Error creating team:', error);
            throw error;
        }
    }

    async updateTeam(team: TeamDTO): Promise<Team> {
        try {
            const data = await firstValueFrom(this.apiService.put<TeamDTO>(`employees`, team));

            return {
                id: data.id,
                name: data.name,
                teamFocus: data.teamFocus,
                teamEmployees: data.employees
            } as Team;
        } catch (error) {
            console.error('Error updating team:', error);
            throw error;
        }
    }

    async deleteTeam(id: number): Promise<void> {
        try {
            if (!id) {
                throw new Error('ID is required to delete an employee.');
            }
            await firstValueFrom(this.apiService.delete(`employees/${id}`));
        } catch (error) {
            console.error('Error deleting team:', error);
            throw error;
        }
    }
}
