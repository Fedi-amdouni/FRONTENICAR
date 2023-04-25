import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../app/models/user";

import {BehaviorSubject, catchError, Observable, of, tap, throwError} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";
import { LocalStorageModule } from 'angular-2-local-storage';


export const AUTH_URL = environment.loginUrl;
export const DEFAULT_SIZE = 10
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  set response(value: string) {
    this._response = value;
  }
  userData!:User;
  USER_DATA = 'userData';

  private _response: string | undefined;


  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    this.userData = this.getUserData() 
  }

  isAdmin(){
    if (!this.userData) {
        return false;
    }
    console.log(this.userData)
    const rolesArray = (this.userData.role || '').split(',');
    const filter = rolesArray.filter((item:any)=> item.includes('Admin')); 
    console.log(filter,rolesArray);
    return filter.length > 0;
}
isProfesseur(){
  if (!this.userData) {
      return false;
  }
  console.log(this.userData)
  const rolesArray = (this.userData.role || '').split(',');
  const filter = rolesArray.filter((item:any)=> item.includes('Professeur')); 
  console.log(filter,rolesArray);
  return filter.length > 0;
}
isEtudiant(){
  if (!this.userData) {
      return false;
  }
  console.log(this.userData)
  const rolesArray = (this.userData.role || '').split(',');
  const filter = rolesArray.filter((item:any)=> item.includes('Etudiant')); 
  console.log(filter,rolesArray);
  return filter.length > 0;
}

myNom():String{if (!this.userData) {
  return ''; // or whatever default value you want to return if the user data is not available
}
let myNom: any = this.userData.nom || ''; // set myId to userData.id if it is defined, otherwise set it to 0
if (typeof myNom === 'string') { // check that myId is a number
  return myNom;
} else {
  return ''; // or whatever default value you want to return if myId is not a number
}

}
myPrenom():String{if (!this.userData) {
  return ''; // or whatever default value you want to return if the user data is not available
}
let myPrenom: any = this.userData.prénom || ''; // set myId to userData.id if it is defined, otherwise set it to 0
if (typeof myPrenom === 'string') { // check that myId is a number
  return myPrenom;
} else {
  return ''; // or whatever default value you want to return if myId is not a number
}

}



myId(): Number {
  if (!this.userData) {
    return 0; // or whatever default value you want to return if the user data is not available
  }
  let myId: any = this.userData.id || 0; // set myId to userData.id if it is defined, otherwise set it to 0
  if (typeof myId === 'number') { // check that myId is a number
    return myId;
  } else {
    return 0; // or whatever default value you want to return if myId is not a number
  }
}

myclasses(): Observable<any[]> {
  if (!this.userData) {
    return of([]);
  }
  console.log(this.userData);
  let mesClasses: any[] = (this.userData.classes || []);
  return of(mesClasses);
}

myRole():String{ if (!this.userData) {
  return ''; // or whatever default value you want to return if the user data is not available
}
let myRole: any = this.userData.role || ''; // set myId to userData.id if it is defined, otherwise set it to 0
if (typeof myRole === 'string') { // check that myId is a number
  return myRole;
} else {
  return ''; // or whatever default value you want to return if myId is not a number
}

}
myMatieres(): Observable<any[]> {
  if (!this.userData) {
    return of([]);
  }
  console.log(this.userData);
  let mesMatieres: any = (this.userData.matiere || []);
  return of(mesMatieres);
}


  
  login(data:any) {
    return this.httpClient.post<User>(<string>AUTH_URL,data).pipe(
      tap((data:User)=> {

        this.userData = data;
        this.localStorage.clearAll();
        this.localStorage.set(this.USER_DATA,data);
        
    
      }),
      catchError(AuthenticationService.handleError)
    )
  }

  logout(){
    this.router.navigate(['/login']);
    
    this.localStorage.clearAll();
    
  }
  
  getUserData(){

    return this.userData || this.localStorage.get(this.USER_DATA);
  }
  private static handleError(error: HttpErrorResponse) {
    return throwError(error)
  }
  
}
 
 
 

