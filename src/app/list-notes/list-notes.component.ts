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
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { switchMap, tap } from 'rxjs';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
  styleUrls: ['./list-notes.component.css']
})
export class ListNotesComponent {
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
  selectedMatiere: String ="";
  array:any[]=[];
  idProfMatiere: number =1 ;
  matieres: any[] = [];
  role:any=""
  updateNotesForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private classService : classService ,
    private router:Router,
    private userService : UserService,
    private authenticationService : AuthenticationService,
    private noteService:NoteService,
    private noteEXAMService:NoteEXAMService,
    private modalService: NgbModal
  ) { 
    this.dataSource = new MatTableDataSource<any>([]);
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]);
    this.role=this.authenticationService.myRole();
    console.log(this.role)
    if(this.role==="Professeur" && !this.displayedColumns.includes('modification')){
      console.log(this.displayedColumns)
      this.displayedColumns.push('modification');
      
    }
    else {
      const index = this.displayedColumns.indexOf('modification');
      if (index >=0) {
        console.log("a")
        console.log(index)
        this.displayedColumns.splice(index, 1);
      }
    }
    
    

  

    this.getMatieres();
    this.getMyClasses();
    this.onClassChange(this.selectedClass);
    
   
    
    console.log(this.classes);
    this.updateNotesForm=this.formBuilder.group({
      noteCC: [null,Validators.required],
      noteEXAM: [null,Validators.required],
    })
    
  

  }

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

  getMatieres(){
    
    this.classService.getMatieres(this.selectedClassId).subscribe(
      (data: any[]) => {  
        console.log('Received matieres data:', data);
        this.matieres = data;
        // map the fetched list of classes to a new array of class names
        console.log(data)
      },
      (error: any) => {
        console.log('Error getting matieres:', error);
      }
    );
    this.fetchStudents();
    
  }


  onClassChange(selectedClass: any): void {
    if (selectedClass) {
      this.selectedClassId = selectedClass.id;
      
      this.getMatieres();
      
      
    }
  }

  update(index: number) {
    this.submitted = true;
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
    if (index && this.authenticationService.myId() && this.updateNotesForm.controls['noteEXAM'] && this.updateNotesForm.controls['noteEXAM'].value != null) {
      this.noteEXAMService.getNote(index, this.authenticationService.myId()).pipe(
        tap((note) => {
          // Modify the returned object to include the updated noteEXAM value
          note.note = this.updateNotesForm.controls['noteEXAM'].value;
        }),
        switchMap((note) => {
          // Use the modified object to update the note
          return this.noteEXAMService.updateNote(index, this.authenticationService.myId(), note);
        })
      ).subscribe(
        (data) => {},
        (error) => console.log('erreur modification', error)
      );
     
    }
    console.log(this.updateNotesForm.controls['noteEXAM'].value)
    if (index && this.authenticationService.myId() && this.updateNotesForm.controls['noteCC'] && this.updateNotesForm.controls['noteCC'].value != null) {
      this.noteService.getNote(index, this.authenticationService.myId()).pipe(
        tap((note) => {
          // Modify the returned object to include the updated noteEXAM value
          note.note = this.updateNotesForm.controls['noteCC'].value;
        }),
        switchMap((note) => {
          // Use the modified object to update the note
          return this.noteService.updateNote(index, this.authenticationService.myId(), note);
        })
      ).subscribe(
        (data) => {location.reload();},
        (error) => console.log('erreur modification', error)
      );
     
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    }})};
    
  
    
    
    

  
  


  onMatiereChange(selectedMatiere: any): void {
    if (selectedMatiere) {
      this.selectedMatiere = selectedMatiere;
      this.userService.getUserByMatiere(this.selectedMatiere).subscribe(
        (data: User) => { 
          console.log(data);
          this.idProfMatiere = data.id;
          console.log(this.idProfMatiere);
        },
        (error) => {
          console.log("erreur", error);
        }
      );
      this.fetchStudents();
    }
  }
  fetchStudents() {
    this.isLoading = true;
    this.classService.getStudentsByClassId(this.selectedClassId).subscribe(data => {
     
     
      for (let i = 0; i < data.length; i++) {
        this.noteService.getNote(data[i]['id'], this.idProfMatiere).subscribe(note => {
          data[i]['noteCC'] = note.note;
          console.log(note)
          
        });
      }
      for (let i = 0; i < data.length; i++) {
        this.noteEXAMService.getNote(data[i]['id'], this.idProfMatiere).subscribe(note => {
          data[i]['noteEXAM'] = note.note;
          console.log(note)
          
        });
      }




      this.dataSource.data = data;
      console.log(data)
      this.isLoading = false;
      console.log(this.dataSource.data);
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
            console.log('Note added successfully:', note);
            // add any additional logic here to handle success
          },
          error => {
            if (error.status === 409) {
              console.log('Note already exists in the database');
              // add any additional logic here to handle the duplicate data
            } else {
              console.error('Error adding note:', error);
              // add any additional logic here to handle other errors
            }
          }
        );
    }
    }


    for (let i = 0; i < data1.length; i++) {
      const rowData = data1[i];
      const id = rowData['id']; // Access the id value for the current row
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
            // add any additional logic here to handle success
          },
          error => {
            if (error.status === 409) {
              console.log('Note already exists in the database');
              // add any additional logic here to handle the duplicate data
            } else {
              console.error('Error adding note:', error);
              // add any additional logic here to handle other errors
            }
          }
        );
    }
    }
  }
}
