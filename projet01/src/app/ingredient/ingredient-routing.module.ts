import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
    {
        path: '',
        component: IngredientListComponent
    },
    {
        path: 'add',
        component: IngredientFormComponent
    },
    {
        path: 'edit/:id',
        component: IngredientFormComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IngredientRoutingModule { }
