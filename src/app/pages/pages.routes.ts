import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EmployeeComponent } from './employee';
import { EmployeeForm } from './employee/form/employee.form';
import { TeamComponent } from './team';
import { TeamListComponent } from './team/team-list/team-list.component';
import { TeamFormComponent } from './team/team-form/team-form.component';
//import { TeamMembersComponent } from './team/team-members/team-members.component'

export const pagesRoutes: Routes = [
   {
    path: 'team',
    children: [
        {path: '', component: TeamListComponent },
        {path: 'create', component: TeamFormComponent },
        {path: 'edit/:id', component: TeamFormComponent },
      //  {path: ':id/members', component: TeamMembersComponent }
    ]
   }
]

export default [
    { path: 'employee', component: EmployeeComponent },
    { path: 'manage-employee/:id', component: EmployeeForm },
    { path: 'team', component: TeamComponent },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;


