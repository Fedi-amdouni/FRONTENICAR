import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { classService } from 'src/services/class.service';
import { finalize,tap } from 'rxjs';
import { Class } from '../models/class';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent {
  addClassForm!: FormGroup;
  submitted = false;
  error= '';
  loadingAddUser = false;
  isLoading = false;


  constructor(
    private formBuilder: FormBuilder,
    private classService : classService ,
    private router:Router,
    
  ) { }

  ngOnInit(): void {
    

    this.addClassForm = this.formBuilder.group({
   
      nom: ['',Validators.required],
      niveau: ['',Validators.required],
      département: ['',Validators.required]
    })
  }
  onSubmit1() {
    this.submitted = true;
    
    console.log(this.addClassForm.value)
    this.classService
      .addClass(this.addClassForm.value)
      .pipe(
        tap(() => {
          this.addClassForm.markAsPending();
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      
      .subscribe({
        next: (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Classe ajoutée avec succés',
            showConfirmButton: false,
            timer: 1500
          });
          
          
        },
        error: (error) =>{
          console.log('ADD failed',error);
          
          // Handle error here
        }
  });
  }
 

}
