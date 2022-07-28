import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ProfilepageComponent } from './pages/profilepage/profilepage.component';
import { InvestmentsComponent } from './pages/investments/investments.component';
import { FitnessComponent } from './pages/fitness/fitness.component';
import { TravelsComponent } from './pages/travels/travels.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
	{ path: 'investments', component: InvestmentsComponent },
	{ path: 'fitness', component: FitnessComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'finance', component: FinanceComponent },
	{ path: 'travels', component: TravelsComponent },
	{ path: '', component: ProfilepageComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: 'home', redirectTo: '' },
	{ path: '**', redirectTo: 'not-found' },
];

@NgModule({
	imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
