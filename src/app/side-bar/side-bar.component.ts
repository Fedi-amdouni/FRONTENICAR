import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import  {Router} from "@angular/router";


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  isAdmin=false;
  isProfesseur=false;
  isEtudiant=false;

  constructor(private authenticationService: AuthenticationService,private router : Router) { }

  ngOnInit(): void {
    this.isAdmin=this.authenticationService.isAdmin();
    this.isProfesseur=this.authenticationService.isProfesseur();
    this.isEtudiant=this.authenticationService.isEtudiant();

  }
  onSubmit1(){
    this.authenticationService.logout();
    
    
   
    
  }

}
