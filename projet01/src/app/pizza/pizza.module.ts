import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaListComponent } from './pizza-list/pizza-list.component';
import { PizzaFormComponent } from './pizza-form/pizza-form.component';
import { HttpClientModule } from '@angular/common/http';
import { PizzaService } from './services/pizza.service';
import { HttpModule } from '@angular/http';
import { PizzaRoutingModule } from './pizza-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngredientService } from '../ingredient/services/ingredient.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddIngredientModalComponent } from './add-ingredient-modal/add-ingredient-modal.component';
import { IngredientModule } from '../ingredient/ingredient.module';
import { IngredientFormComponent } from '../ingredient/ingredient-form/ingredient-form.component';
import { PizzaDetailComponent } from './pizza-detail/pizza-detail.component';
import { FileDropModule } from 'ngx-file-drop';
import { UploadModule } from '../shared/components/file-upload/file-upload.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    PizzaRoutingModule,
    NgSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    IngredientModule,
    FileDropModule,
    UploadModule
  ],
  declarations: [
    PizzaFormComponent,
    PizzaListComponent,
    AddIngredientModalComponent,
    PizzaDetailComponent,
    // IngredientFormComponent
  ],
  providers: [
    PizzaService,
    IngredientService
  ]
})
export class PizzaModule { }
