/*import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../service/team.service';
import { EmployeeService } from '../../service/employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../../models/employee.model';

import { Team } from '../../models/team.model';
import { Listbox } from "primeng/listbox";

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss'],
  imports: [Listbox]
})
export class TeamMembersComponent implements OnInit {
  teamId!: string;
  team: Team | undefined;
  employees: Employee[] = [];
  availableEmployees: Employee[] = [];
  selectedEmployee: string = '';

  constructor(
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];

    // Carregar time
    this.teamService.getTeams().then(teams => {
      const team = teams.find((t: any) => t.id === this.teamId);
      this.team = team;

      // Carregar membros do time
      if (team && team.employees && team.employees.length > 0) {
        // Fetch each employee by ID and collect the results
        Promise.all(team.employees.map((id: string) =>
          this.employeeService.getEmployeeById(id)
        )).then(employees => {
          this.employees = (employees.filter((e: Employee | undefined): e is Employee => !!e)) as Employee[];
        });
      }
    });

    // Carregar funcionários disponíveis
    this.employeeService.getEmployees().then(employees => {
      this.availableEmployees = employees;
    });
  }

  addEmployee(): void {
    if (this.selectedEmployee) {
    this.teamService.addEmployeeToTeam(this.teamId, this.selectedEmployee).subscribe((updatedTeam: Team) => {
      this.team = updatedTeam;
      const newEmployee: Employee | undefined = this.availableEmployees.find((e: Employee) => e.id === this.selectedEmployee);
      if (newEmployee) {
        this.employees.push(newEmployee);
        this.availableEmployees = this.availableEmployees.filter((e: Employee) => e.id !== this.selectedEmployee);
        this.selectedEmployee = '';
      }
    });
    }
  }

  removeEmployee(employeeId: string): void {
    this.teamService.removeEmployeeFromTeam(this.teamId, employeeId).subscribe((updatedTeam: any) => {
      this.team = updatedTeam;
      const removedEmployee = this.employees.find(e => e.id === employeeId);
      if (removedEmployee) {
        this.employees = this.employees.filter(e => e.id !== employeeId);
        this.availableEmployees.push(removedEmployee);
      }
    });
  }
}
  */
