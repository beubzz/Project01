import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, ExtraOptions, PreloadAllModules } from '@angular/router';

import { PizzaListComponent } from './pizza/pizza-list/pizza-list.component';
import { IngredientListComponent } from './ingredient/ingredient-list/ingredient-list.component';
import { CommonModule } from '@angular/common';
import { IngredientModule } from './ingredient/ingredient.module';
import { HomeComponent } from './home/home.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const appRoutes: Routes = [
    /****************   PROJECTS SUB ITEMS SECTION -- LAZY LOADED *********************/
    {
        /* for easy loading, moved the sub and line to app-routing-sub-line.module and used inside app-components-sub-line.module */
        // path: 'projects/:projectId/sub', loadChildren: './app-components-sub-line.module#AppComponentsSubAndLineModule'
        path: 'ingredient',
        loadChildren: "./ingredient/ingredient.module#IngredientModule"
        // loadChildren: () => IngredientModule
    },
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'pizza',
        loadChildren: "./pizza/pizza.module#PizzaModule"
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }