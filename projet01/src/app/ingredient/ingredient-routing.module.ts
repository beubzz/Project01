import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
    {
        path: '',
        component: IngredientListComponent,
        data: {
            heading: 'Liste des ingredients'
        }
    },
    {
        path: 'add',
        component: IngredientFormComponent,
        data: {
            heading: 'Ajouter un Ingredient',
            parent: {
                title: [`Liste des ingredients`],
                link: [`/ingredient`],
            },
        }
    },
    {
        path: 'edit/:id',
        component: IngredientFormComponent,
        data: {
            heading: 'Modifier un Ingredient',
            parent: {
                title: [`Ingredient`],
                link: [`/ingredient`],
            },
        }
    },
    // example multi niveau :
    {
        path: 'add/test',
        component: IngredientFormComponent,
        data: {
            heading: 'Ajouter un 2em Ingredient',
            parent: {
                title: [`Ingredient`, `Ajouter un Ingredient`],
                link: [`/ingredient/`, `/ingredient/add`],
            },
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IngredientRoutingModule { }
