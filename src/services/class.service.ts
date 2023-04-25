import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Class} from "../app/models/class";
import {BehaviorSubject, Observable, catchError, tap, throwError} from "rxjs";
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import {User} from "../app/models/user";


export const CLASS_URL = environment.classUrl;
@Injectable({
    providedIn: 'root'
  })
export class classService {
   
   
    constructor(
        private httpClient: HttpClient,
      ) { }
    addClass(data:any){
        return this.httpClient.post<Class>(<string>CLASS_URL,data);
    }
    listClasses(filters:any = [],page:number=1,orderBy:string= 'nom',orderDirection:string= 'ASC'):Observable<any>{
        const headers = new HttpHeaders({
          'content-type': 'application/json'});
          const body = {
            filters: filters,
            order:[ {
              column: orderBy,
              direction: orderDirection
            }],
            pagination: {
              
              page: page
            }
          }
          return this.httpClient.get<Class[]>(<string>CLASS_URL+'/list')
          .pipe(
            tap((response) => console.log(response)),
            catchError((error) => throwError(error))
          );
      }
      listTheClasses(){
        const url = `${CLASS_URL}/list`;
        return this.httpClient.get<Class[]>(url);
      }
      

      getStudentsByClassId(classId: number): Observable<User[]> {
        const url = `${CLASS_URL}/${classId}/students`;
        return this.httpClient.get<User[]>(url);
      }

      getProfessorsByClassId(classId:number):Observable<User[]>{
        const url = `${CLASS_URL}/${classId}/professeurs`;
        return this.httpClient.get<User[]>(url);
      }
    
      getMatieres(classId:number){
        const url = `${CLASS_URL}/${classId}/matieres`;
        return this.httpClient.get<User[]>(url);
      }

      }
     
      
     



