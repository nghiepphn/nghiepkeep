import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPayload, RegisterPayload } from '@lib/interfaces';
import { AuthService } from '@lib/services';
import { ToastrService } from 'ngx-toastr';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['login.component.css'],
})
export class LoginComponent {
    constructor(private authService: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService) {}

    private readonly _router = inject(Router);

    profileForm: any;
    createForm: any;

    ngOnInit(): void {
        this.profileForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.createForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            gender: ['male', [Validators.required]],
            birthDate: ['', [Validators.required]],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.createForm.controls;
    }
    get l(): { [key: string]: AbstractControl } {
        return this.profileForm.controls;
    }

    isHasError = false;
    msgErrorLogin = '';
    submitted = false;
    signup = false;

    onSubmit() {
        this.signup = true;
        if (this.profileForm.invalid) {
            return;
        }
        const userInfo = this.profileForm.value as Required<LoginPayload>;
        this.authService.login(userInfo).subscribe({
            next: (data) => {
                const token = data.accessToken;
                if (token) {
                    this.authService.setToken(data);
                    this._router.navigate(['']);
                }
            },
            error: (err) => {
                this.msgErrorLogin = err.error.message;
                this.isHasError = true;
            },
        });
    }

    msgErrorRegister = '';
    isHasErrorRegister = false;

    onSignUp() {
        this.submitted = true;
        if (this.createForm.invalid) {
            return;
        }
        const createFormInfo = this.createForm.value as Required<RegisterPayload>;
        this.authService.register(createFormInfo).subscribe({
            next: (res: any) => {
                console.log(res);
                this.toastr.success('Registered successfully');
                this.submitted = false;
                this.switchMode(false);
                this.createForm.reset({
                    username: '',
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    gender: 'male',
                    birthDate: '',
                });
            },
            error: (err) => {
                this.msgErrorRegister = err.error.message;
                this.isHasErrorRegister = true;
            },
            complete: () => {
                this.isHasErrorRegister = false;
            },
        });
    }

    mode = 'container';
    switchMode(isLogin: boolean) {
        if (isLogin) {
            this.mode += ' right-panel-active';
        } else {
            this.mode = 'container';
        }
    }
}
