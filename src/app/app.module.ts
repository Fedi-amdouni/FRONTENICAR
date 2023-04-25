import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { AddClassComponent } from './add-class/add-class.component';
import { ListClassesComponent } from './list-classes/list-classes.component';
import { MatTableModule } from '@angular/material/table';
import { NotesComponent } from './notes/notes.component';
import { RendreNotesComponent } from './rendre-notes/rendre-notes.component';
import { ListNotesComponent } from './list-notes/list-notes.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GcPdfViewer } from '@grapecity/gcpdfviewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {MatInputModule} from '@angular/material/input';







const routes:Routes=[
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"home",component:MainMenuComponent,
children:[
  {path:"addUser",component:AddUserComponent},
  {path:"addClass",component:AddClassComponent},
  {path:"listClasses",component:ListClassesComponent},
  {path:"rendreNotes",component:RendreNotesComponent},
  {path:"listNotes",component:ListNotesComponent}
  

  
]}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LoginComponent,
    MainMenuComponent,
    SideBarComponent,
    AddUserComponent,
    AddClassComponent,
    ListClassesComponent,
    NotesComponent,
    RendreNotesComponent,
    ListNotesComponent
  ],
  imports: [LocalStorageModule.forRoot({
    prefix: 'my-app',
    storageType: 'localStorage'
  }),
    BrowserModule,
    FontAwesomeModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    PdfViewerModule,
    MatInputModule,
    
    
    
    
  
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
