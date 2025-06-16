import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { firstValueFrom } from 'rxjs';

export interface EmployeeDTO {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface CreateEmployeeDto {
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
    administrator: { name: 'Administrator', value: 'admin' },
    developer: { name: 'Software Engineer', value: 'developer' },
    manager: { name: 'Manager', value: 'manager' },
    'product owner': { name: 'Product Owner', value: 'product_owner' },
    'tech leader': { name: 'Tech Leader', value: 'tech_leader' }
};

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private apiService: APIService) {}

    async getEmployeeById(id: string): Promise<Employee | null> {
        const employeeData = await this.apiService.get<EmployeeDTO>(`employees/${id}`).toPromise();
        if (!employeeData) {
            return null;
        }
        return {
            id: employeeData.id,
            name: employeeData.name,
            email: employeeData.email,
            role: roleNameMapping[employeeData.role.toLowerCase()]
        };
    }

    async getEmployees(): Promise<Employee[]> {
        const employeesData: Employee[] = [];
        await this.apiService.get<EmployeeDTO[]>('employees').subscribe((data) =>
            data.forEach((employeeData) => {
                console.log(employeeData);
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

    async createEmployee(employee: CreateEmployeeDto): Promise<Employee> {
        try {
            if (!employee.name || !employee.email || !employee.role) {
                throw new Error('Name, email, and role are required to create an employee.');
            }
            console.log('Creating employee:', employee);
            const data = await firstValueFrom(this.apiService.post<EmployeeDTO>('employees', employee));
            return {
                id: data.id,
                name: data.name,
                email: data.email,
                role: roleNameMapping[data.role.toLowerCase()]
            } as Employee;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    async updateEmployee(employee: EmployeeDTO): Promise<Employee> {
        try {
            if (!employee.id) {
                throw new Error('ID is required to update an employee.');
            }
            const roleKey = employee.role.toLowerCase();
            if (!roleNameMapping[roleKey]) {
                throw new Error(`Invalid role: ${employee.role}`);
            }
            employee.role = roleKey;
            const data = await firstValueFrom(this.apiService.put<EmployeeDTO>(`employees`, employee));

            return {
                id: data.id,
                name: data.name,
                email: data.email,
                role: roleNameMapping[data.role.toLowerCase()]
            } as Employee;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    async deleteEmployee(id: number): Promise<void> {
        try {
            if (!id) {
                throw new Error('ID is required to delete an employee.');
            }
            await firstValueFrom(this.apiService.delete(`employees/${id}`));
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    getAllRolesMapping(): Role[] {
        return Object.values(roleNameMapping);
    }
}
