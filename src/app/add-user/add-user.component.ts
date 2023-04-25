  import { Component } from '@angular/core';
  import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { UserService } from 'src/services/user.service';
  import { finalize,tap } from 'rxjs';
  import { User } from '../models/user';
  import { classService } from 'src/services/class.service';
  import Swal from 'sweetalert2';

  @Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
  })
  export class AddUserComponent {
    
    addUserForm!: FormGroup;
    submitted = false;
    error= '';
    loadingAddUser = false;
    isLoading = false;
  
    classes: any[] = [];
    classNames: string[] = [];
    constructor(
      private formBuilder: FormBuilder,
      private userService : UserService ,
      private router:Router,
      private classService : classService
    ) { }

    ngOnInit(): void {
      this.getClasses();
    

     

      this.addUserForm = this.formBuilder.group({
        adrMail:  ['',[Validators.required,Validators.email]],
        nom: ['',Validators.required],
        prénom: ['',Validators.required],
        role: ['',Validators.required],
        classes: ['',Validators.required],
        matiere: ['',Validators.required],

        password:  ['',Validators.required],
        numTel:  ['',Validators.required]
      })
    }
    onSubmit1() {
      this.submitted = true;
      
      console.log(this.addUserForm.value)
      this.userService
        .addUser(this.addUserForm.value)
        .pipe(
          tap(() => {
            this.addUserForm.markAsPending();
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
              title: 'Utilisateur ajouté avec succés',
              showConfirmButton: false,
              timer: 1500
            });
            location.reload();
            
          },
          error: (error) =>{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Utilisateur non ajouté',
              footer: '<a href="">Why do I have this issue?</a>'
            })
            console.log('ADD failed',error);
            
            // Handle error here
          }
    });
    }
    getClasses() {

      this.classService.listClasses().subscribe(
        (data: any[]) => {
          console.log('Received class data:', data);
          this.classes = data;
          // map the fetched list of classes to a new array of class names
          
        },
        (error) => {
          console.log('Error getting classes:', error);
        }
      );
    }
    
    
    
    

  }