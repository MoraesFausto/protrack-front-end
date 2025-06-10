import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EmployeeComponent } from './employee';
import { EmployeeForm } from './employee/form/employee.form';

export default [
    { path: 'employee', component: EmployeeComponent },
    { path: 'manage-employee/:id', component: EmployeeForm },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
