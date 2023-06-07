import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: 'converter',
        loadComponent: () => import('./components/converter/converter.component').then(m => m.ConverterComponent),
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
export class AppRoutingModule {}
