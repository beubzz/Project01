import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PizzaListComponent } from './pizza-list/pizza-list.component';
import { PizzaFormComponent } from './pizza-form/pizza-form.component';
import { AddIngredientModalComponent } from './add-ingredient-modal/add-ingredient-modal.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
    {
        path: '',
        component: PizzaListComponent
    },
    {
        path: 'add',
        component: PizzaFormComponent
    },
    {
        path: 'test',
        component: AddIngredientModalComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PizzaRoutingModule { }
