import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatGridListModule, MatCardModule, MatMenuModule } from '@angular/material';
import { NameComponent } from './name/name.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PizzaFormComponent } from './pizza/pizza-form/pizza-form.component';
import { PizzaListComponent } from './pizza/pizza-list/pizza-list.component';
import { PizzaModule } from './pizza/pizza.module';
import { PizzaService } from './pizza/services/pizza.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyNavComponent,
    NameComponent,
    MyDashboardComponent,
    PizzaListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    PizzaModule
  ],
  providers: [PizzaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
