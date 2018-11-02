import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaListComponent } from './pizza-list/pizza-list.component';
import { PizzaFormComponent } from './pizza-form/pizza-form.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [PizzaFormComponent] // PizzaListComponent, 
})
export class PizzaModule { }
