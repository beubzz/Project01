import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientRoutingModule } from './ingredient-routing.module';
import { IngredientService } from './services/ingredient.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { IngredientDetailComponent } from './ingredient-detail/ingredient-detail.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    IngredientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    IngredientFormComponent,
    IngredientListComponent,
    IngredientDetailComponent
  ],
  providers: [
    IngredientService
  ],
  exports: [
    IngredientFormComponent,
    IngredientListComponent
  ]
})
export class IngredientModule { }
