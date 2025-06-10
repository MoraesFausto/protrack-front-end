import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Customer, CustomerService } from '../service/customer.service';
import { Product, ProductService } from '../service/product.service';
import { Employee, EmployeeService, Role } from '../service/employee.service';
import { Router } from '@angular/router';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-employee-table',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule
    ],
    templateUrl: './employee.component.html',
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [ConfirmationService, MessageService, CustomerService, ProductService, EmployeeService]
})
export class EmployeeComponent implements OnInit {
    employees: Employee[] = [];

    roles: Role[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    balanceFrozen: boolean = false;

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private employeeService: EmployeeService
    ) {}

    ngOnInit() {
        this.fetchEmployees();

        this.roles = this.employeeService.getAllRolesMapping();

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    async fetchEmployees() {
        await this.employeeService.getEmployees().then((employees) => {
            console.log(employees);
            this.employees = employees;
            this.loading = false;
        });
        console.log(this.employees);
    }

    onAdd() {
        this.router.navigate(['/pages/manage-employee', 'new']);
    }

    onEdit(emp: Employee) {
        console.log('edit', emp);
        this.router.navigate(['/pages/manage-employee', emp.id]);
    }

    onDelete(emp: Employee) {
        this.employeeService.deleteEmployee(emp.id).then(() => {
            this.employees = this.employees.filter((e) => e.id !== emp.id);
        });
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach((product) => (product && product.name ? (this.expandedRows[product.name] = true) : ''));
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
    }

    getSeverity(status: string) {}

    calculateCustomerTotal(name: string) {
        let total = 0;

        return total;
    }
}
