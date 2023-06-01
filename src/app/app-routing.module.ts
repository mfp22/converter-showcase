import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: 'converter',
        loadChildren: () => import('./converter/converter.module').then((m) => m.ConverterModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'converter',
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
