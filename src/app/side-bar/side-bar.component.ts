import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import  {Router} from "@angular/router";
import { classService } from 'src/services/class.service';

import { DomSanitizer , SafeUrl  } from '@angular/platform-browser';
import { env } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  
})

export class SideBarComponent implements OnInit {
  isAdmin=false;
  isProfesseur=false;
  isEtudiant=false;
  nom:any=[];
  prenom:any=[];
  url:any=[] ;
  class:any=[];
  depa:any=[]
  

  constructor(
    private authenticationService: AuthenticationService,
    private router : Router,
    private classService:classService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.isAdmin=this.authenticationService.isAdmin();
    this.isProfesseur=this.authenticationService.isProfesseur();
    this.isEtudiant=this.authenticationService.isEtudiant();
    this.nom=this.authenticationService.myNom();
    this.prenom=this.authenticationService.myPrenom();
 
    this.authenticationService.myclasses().subscribe(
      (data: any[]) => {  
        console.log('Received class data:', data);
        this.class = data;
        // map the fetched list of classes to a new array of class names
        console.log(data)
      },
      (error: any) => {
        console.log('Error getting classes:', error);
      }
    );
    this.depa=this.class[0]['département'];
    console.log(this.depa);
    if (this.depa==="Informatique")
    this.url="http://www.enicarthage.rnu.tn/uploads/Documents_Document/9c9749bbb9639039d9e21c68bbdd8830.EDT%20INFO%20S2%202023_compressed.pdf";
    else if (this.depa==="Mecatronique")
    this.url="http://www.enicarthage.rnu.tn/uploads/Documents_Document/9a93aa273295e8708610f0cc8558e8b1.MAJ1-EDT-MECA-SEM2-2023.pdf";
    else if (this.depa==="Indistruelle")
    this.url = "http://www.enicarthage.rnu.tn/uploads/Documents_Document/1908b7cab90f56942d0e24fd88d91482.MAJ-EDT-GSIL-SEM2-2023.pdf";
    else if (this.depa==="Infotronique")
    this.url="http://www.enicarthage.rnu.tn/uploads/Documents_Document/8bebfdcc2078332c4bc8cd6068477826.MAJ1-EDT-GSI-SEM2-2023.pdf";
    

    
  }
  onSubmit1(){
    this.authenticationService.logout();
  }
  fire(){
    Swal.fire({
      icon: 'success',
      text: `Vous etes redirigé à votre emploi`,
      showConfirmButton: false,
      timer: 2500
    });
  }
   
    
    
    
  }
 


