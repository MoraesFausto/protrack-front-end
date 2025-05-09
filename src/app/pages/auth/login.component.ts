import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    returnUrl: string = '';

    username: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private readonly authService: AuthService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.returnUrl = params['returnUrl'] || '/';
        });
    }

    async login() {
        await this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
                console.log('Login successful:', response);
                this.messageService.add({ severity: 'success', summary: 'Login Success', detail: 'Login successful' });
                this.router.navigate([this.returnUrl]);
            },
            error: (error) => {
                console.error('Login failed:', error);
                this.messageService.add({ severity: 'error', summary: 'Authentication Error', detail: error.error.message });
            }
        });
    }
}
