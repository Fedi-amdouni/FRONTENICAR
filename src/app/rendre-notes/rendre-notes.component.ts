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
import { Note } from '../models/Note';
import { NoteService } from 'src/services/notes.service';
import { NoteEXAMService } from 'src/services/notesExam.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-rendre-notes',
  templateUrl: './rendre-notes.component.html',
  styleUrls: ['./rendre-notes.component.css']
})
export class RendreNotesComponent {
  result: any[] = [];
  totalFiltered: number = 0;
  dataSource: MatTableDataSource<any> ;
  displayedColumns: string[] = ['id','nom','prénom','noteCC','noteEXAM'];
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
  array:any[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private classService : classService ,
    private router:Router,
    private userService : UserService,
    private authenticationService : AuthenticationService,
    private noteService:NoteService,
    private noteEXAMService:NoteEXAMService
  ) { 
    this.dataSource = new MatTableDataSource<any>([]);
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]);
    this.getMyClasses();
    const etudiantsBtn= document.querySelector('#etudiantsBtn');
    const professeursBtn=document.querySelector('#professeursBtn');
    if(etudiantsBtn){
    etudiantsBtn.addEventListener('click', () => {
      console.log('Button Etudiants clicked');
      this.fetchStudents();
    });
    }
    if(professeursBtn){
    professeursBtn.addEventListener('click', () => {
      this.fetchProfessors();
      console.log('Button Professeurs clicked');
    });
    }
    console.log(this.classes);
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
  onSubmit1(){
    const data1 = this.dataSource.data;
    for (let i = 0; i < data1.length; i++) {
      const rowData = data1[i];
      console.log(rowData);
      const id = rowData['id']; // Access the id value for the current row
      const noteCC = rowData['noteCC'];
    const data = {
      subject: this.authenticationService.userData['matiere'],
      classes: { id: this.selectedClass.id },
      note: noteCC,
      student: { id: id },
      professor: { id: this.authenticationService.userData.id }
    };
    if (data.note) {
      this.noteService.addNote(data)
        .subscribe(
          note => {
            Swal.fire({
              icon: 'success',
              title: 'Notes bien attribués',
              showConfirmButton: false,
              timer: 1500
            });
            
          },
          error => {
            if (error.status === 409) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Note déja attribué !Essayez de la modifier si vous voulez',
                
              })
           
            } else {
              console.error('Error adding note:', error);
             
            }
          }
        );
    }
    }


    for (let i = 0; i < data1.length; i++) {
      const rowData = data1[i];
      const id = rowData['id'];
      const noteEXAM = rowData['noteEXAM'];
    const data = {
      subject: this.authenticationService.userData['matiere'],
      classes: { id: this.selectedClass.id },
      note: noteEXAM,
      student: { id: id },
      professor: { id: this.authenticationService.userData.id }
    };
    if (data.note) {
      this.noteEXAMService.addNote(data)
        .subscribe(
          note => {
            console.log('Note added successfully:', note);
            
          },
          error => {
            if (error.status === 409) {
              console.log('Note already exists in the database');
         
            } else {
              console.error('Error adding note:', error);
            
            }
          }
        );
    }
    }
  }
  }




