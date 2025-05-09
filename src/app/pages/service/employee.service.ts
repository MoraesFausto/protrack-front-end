import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private apiService: APIService) {}

    getEmployees() {
        return this.apiService.get('employees');
    }
}
