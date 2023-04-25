import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize , tap } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { User } from '../models/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  error = '';
  loadingLogin = false;
  isLoading = false;
  nom:any="";
  prenom:any="";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
  }
  

  onSubmit() {
    this.prenom=this.authenticationService.myPrenom();
    console.log(this.prenom);
    
    
    this.submitted = true;
    this.loadingLogin = true;
    console.log(this.loginForm.value)
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        tap(() => {
          this.loginForm.markAsPending();
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      
      .subscribe({
        next: (data: User) => {
          Swal.fire({
            icon: 'success',
            text: `Soyez les bienvenus ${this.prenom}`,
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/home']);
        },
        error: (error) =>{
          console.log('Login failed',error);

        }
  });
     
      
  }
}
