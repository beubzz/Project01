import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IngredientFormComponent, IngredientListComponent]
})
export class IngredientModule { }
