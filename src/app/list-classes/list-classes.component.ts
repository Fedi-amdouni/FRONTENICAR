import { Component ,NgModule } from '@angular/core';
import { classService } from 'src/services/class.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from 'src/services/user.service';
import { Class } from '../models/class';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';
import { NoteService } from 'src/services/notes.service';
import { NoteEXAMService } from 'src/services/notesExam.service';
import { Note } from '../models/Note';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.css']
})
export class ListClassesComponent {
  result: any[] = [];
  totalFiltered: number = 0;
  dataSource: MatTableDataSource<any> ;
  displayedColumns: string[] = ['id','nom','prénom','adrMail','numTel'];
  isLoading=false;
  closeResult = '';
  ELEMENT_DATA: any[] = [];
  classes: Class[] = [];
  id=1;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 1, 25, 100];
  submitted = false;
  error= '';
  selectedClass: any = 1;
  selectedClassId: number =0;
  idEtu:number=0;
  idProf:number=0;
  note:number=0;
  isProfesseursSelected = false;
  role:any=""
  updateUserForm!:FormGroup
  


  constructor(
    private formBuilder: FormBuilder,
    private classService : classService ,
    private router:Router,
    private userService : UserService,
    private authenticationService : AuthenticationService,
    private noteService : NoteService,
    private noteEXAMService:NoteEXAMService,
    private modalService: NgbModal
    
  ) { 
    this.dataSource = new MatTableDataSource<any>([]);
   
  }
  ngOnInit(): void {
    this.role=this.authenticationService.myRole();

    this.updateUserForm=this.formBuilder.group({
      id: [null,Validators.required],
      nom: [null,Validators.required],
      prénom: [null,Validators.required],
      adrMail: [null,Validators.required],
      numTel: [null,Validators.required],
      role: ['',Validators.required],
      classes: ['',Validators.required],
      matiere: ['',Validators.required],

      password:  ['',Validators.required],
      
    })
    const etudiantsBtn= document.querySelector('#etudiantsBtn');
    const professeursBtn=document.querySelector('#professeursBtn');
    if(etudiantsBtn){
    etudiantsBtn.addEventListener('click', () => {
      console.log('Button Etudiants clicked');
      const index = this.displayedColumns.indexOf('matiere');
      if (index !== -1) {
        this.displayedColumns.splice(index, 1);
      }
      this.fetchStudents();
    });
    }
    if(professeursBtn){
    professeursBtn.addEventListener('click', () => {
      this.fetchProfessors();
      if (!this.displayedColumns.includes('matiere')) {
        this.displayedColumns.push('matiere');
      }

      console.log('Button Professeurs clicked');
    });
    }



    if(this.role==="Admin" && !this.displayedColumns.includes('modification')){
      console.log(this.displayedColumns)
      this.displayedColumns.push('modification');
      this.displayedColumns.push('suppression')
      
    }
    else {
      const indexS = this.displayedColumns.indexOf('suppression');
      if (indexS >=0) {
        this.displayedColumns.splice(indexS, 1);
      }
      const indexM= this.displayedColumns.indexOf('modification');
      if (indexM >=0) {
        this.displayedColumns.splice(indexM, 1);
      }
    }
    this.getMyClasses();
    
    
    
    
    console.log(this.classes);
    
  }
  /*getClasses() {
    this.classService.listClasses().subscribe(
      (data: any[]) => {  
        console.log('Received class data:', data);
        this.classes = data;
        // map the fetched list of classes to a new array of class names
        console.log(data)
      },
      (error) => {
        console.log('Error getting classes:', error);
      }
    );
  }*/




private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return '';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return '';
  } else {
    return `with: ${reason}`;
  }
}
open(content: any) {
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}


  removeUser(index:number){
    this.userService.deleteUser(index).subscribe((data:any)=>{
      location.reload();
    })
  }





  getMyClasses(){
    this.authenticationService.myclasses().subscribe(
      (data: any[]) => {  
        console.log('Received class data:', data);
        this.classes = data;
        // map the fetched list of classes to a new array of class names
        console.log(data)
      },
      (error: any) => {
        console.log('Error getting classes:', error);
      }
    );
    if(this.role=="Admin"){
      this.classService.listTheClasses().subscribe(
        (data:any[])=> {
          
          this.classes=data;
        }
      ),
      (error:any)=> console.log('Error getting classes:', error);
    }

  }
  
  onClassChange(selectedClass: any): void {
    if (selectedClass) {
      this.selectedClassId = selectedClass.id;
      this.fetchStudents();
    }
  }
  fetchStudents() {
    this.isLoading = true;
    this.classService.getStudentsByClassId(this.selectedClassId).subscribe(data => {
      this.dataSource.data = data;
      this.isLoading = false;
      console.log(this.dataSource.data)
    }, error => {
      console.log('Error fetching students:', error);
      this.isLoading = false;
    });
  
   
    
    

    

  }

  update(index:number){
    console.log(index);
    this.userService.patchUser(this.updateUserForm.value ,index).subscribe(
      (user: User) => {
        Swal.fire({
          icon: 'success',
          title: 'Utilisateur modifié avec succés',
          showConfirmButton: false,
          timer: 1500
        });
        location.reload();
        
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Utilisateur non modifié',
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
    );
  }

  fetchProfessors() {
    this.isLoading = true;
    this.classService.getProfessorsByClassId(this.selectedClassId).subscribe(data => {
      this.dataSource.data = data;
      this.isLoading = false;
      console.log(this.dataSource.data)
    }, error => {
      console.log('Error fetching students:', error);
      this.isLoading = false;
    });
  }

  getNotes(){
    this.noteService.getNote(this.idEtu,this.idProf).subscribe(data=>{
      this.note=data.note;
    },error=>{
    console.log("ERROR GETTING NOTE",error)
  });
    

  }
}
