import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './shared/layout/my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatGridListModule, MatCardModule, MatMenuModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { MyDashboardComponent } from './shared/layout/my-dashboard/my-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { FileDropModule } from 'ngx-file-drop';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyNavComponent,
    MyDashboardComponent,
    // UploadModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    NgbModule,
    FormsModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    RouterModule
  ]
})
export class AppModule { }

// TODO :
// Pizza and Ingredient Details
// full commentary code
// Ingredient Form for edit case !
// error message on form
// Add toastr un peu de partout ;)
// TODO (secondary)
// pizza autocomplete ?
// navigation routing (with button etc ...)
// Styles ...

// - REMETTRE AU PROPRE : 
// - pizzaController -> faire des verification / validateur + gestion des err etc ! (propre + secure)
// - pizzaForm html et ts faire propre + securisé un minimum !

// - supprimer les images uploader if delete de la pizza ou ingredient mais si cet element uniquement contenais cette images

// LEAFLET ;) 