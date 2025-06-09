import { Injectable } from '@angular/core';
import { APIService } from './api.service';

export interface EmployeeDTO {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Role {
    name: string;
    value: string;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export const roleNameMapping: { [key: string]: Role } = {
    admin: { name: 'Administrator', value: 'admin' },
    developer: { name: 'Software Engineer', value: 'developer' },
    manager: { name: 'Manager', value: 'manager' },
    product_owner: { name: 'Product Owner', value: 'product_owner' },
    tech_leader: { name: 'Tech Leader', value: 'tech_leader' }
};

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private apiService: APIService) {}

    async getEmployees(): Promise<Employee[]> {
        const employeesData: Employee[] = [];
        await this.apiService.get<EmployeeDTO[]>('employees').subscribe((data) =>
            data.forEach((employeeData) => {
                const employee: Employee = {
                    id: employeeData.id,
                    name: employeeData.name,
                    email: employeeData.email,
                    role: roleNameMapping[employeeData.role.toLowerCase()]
                };
                employeesData.push(employee);
            })
        );
        return employeesData;
    }

    getAllRolesMapping(): Role[] {
        return Object.values(roleNameMapping);
    }
}
