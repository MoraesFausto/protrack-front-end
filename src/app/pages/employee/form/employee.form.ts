import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { CreateEmployeeDto, Employee, EmployeeDTO, EmployeeService, Role } from '../../service/employee.service';
import { CustomerService } from '../../service/customer.service';
import { ProductService } from '../../service/product.service';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DropdownModule, MultiSelectModule],
    templateUrl: './employee.form.html',
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
export class EmployeeForm implements OnInit {
    @Input()
    employeeId: string | null = null;
    @Input()
    roles: Role[] = [
        { name: 'Administrator', value: 'admin' },
        { name: 'Software Engineer', value: 'developer' },
        { name: 'Manager', value: 'manager' },
        { name: 'Product Owner', value: 'product_owner' },
        { name: 'Tech Leader', value: 'tech_leader' }
    ];

    employee: Employee | null = null;
    employeeForm!: FormGroup;

    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService
    ) {}

    ngOnInit() {
        this.initializeForm();

        this.route.paramMap.subscribe((params) => {
            const idParam = params.get('id');
            if (idParam && idParam !== 'new') {
                this.isEditMode = true;
                this.employeeId = idParam;
            }
        });
        this.isEditMode = !!this.employeeId;
        if (this.isEditMode) {
            this.fetchEmployeeData();
        } else {
            this.initializeForm();
        }
    }

    async fetchEmployeeData() {
        await this.employeeService.getEmployeeById(this.employeeId!).then((employee) => {
            this.employee = employee;
            this.employeeForm = this.fb.group({
                id: [{ value: this.employee?.id || null, disabled: this.isEditMode }],
                name: [this.employee?.name || '', Validators.required],
                email: [this.employee?.email || '', [Validators.required, Validators.email]],
                role: [this.employee?.role || null, Validators.required]
            });
        });
    }

    initializeForm() {
        this.employeeForm = this.fb.group({
            id: [{ value: null, disabled: this.isEditMode }],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: [null, Validators.required]
        });
    }

    onSubmit() {
        if (this.employeeForm.valid) {
            const data: Employee = {
                ...this.employeeForm.getRawValue()
            };
            if (this.isEditMode) {
                const employeeRequest = { ...data, id: Number(this.employeeId!), role: data.role.name } as EmployeeDTO;

                this.employeeService.updateEmployee(employeeRequest).then(
                    (updatedEmployee) => {
                        this.router.navigate(['/pages/employee']);
                    },
                    (error) => {
                        console.error('Error updating employee:', error);
                    }
                );
            } else {
                const employeeRequest = { ...data, role: data.role.name } as CreateEmployeeDto;

                this.employeeService.createEmployee(employeeRequest).then(
                    (newEmployee) => {
                        this.router.navigate(['/pages/employee']);
                    },
                    (error) => {
                        console.error('Error creating employee:', error);
                    }
                );
            }
        }
    }

    onCancel() {
        // lógica para cancelar (por exemplo, resetar o form ou navegar de volta)
        this.employeeForm.reset();
    }
}
