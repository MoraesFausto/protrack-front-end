import { Routes } from '@angular/router';
import { Access } from './access';
import { LoginComponent } from './login.component';
import { Error } from './error';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: LoginComponent }
] as Routes;
