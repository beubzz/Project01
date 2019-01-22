import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';
import { PizzaFormComponent } from './components/pizza-form/pizza-form.component';
import { AddIngredientModalComponent } from './components/add-ingredient-modal/add-ingredient-modal.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
    {
        path: '',
        component: PizzaListComponent,
        data: {
            heading: 'Liste des pizza'
        }
    },
    {
        path: 'add',
        component: PizzaFormComponent,
        data: {
            heading: 'Ajouter une Pizza',
            parent: {
                title: [`Liste des pizza`],
                link: [`/pizza`],
            },
        }
    },
    {
        path: 'edit/:id',
        component: PizzaFormComponent,
        data: {
            heading: 'Modifier une Pizza',
            parent: {
                title: [`liste des pizza`],
                link: [`/pizza`],
            },
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PizzaRoutingModule { }
