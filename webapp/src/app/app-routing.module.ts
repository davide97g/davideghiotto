import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ProfilepageComponent } from './pages/profilepage/profilepage.component';
import { RegisterpageComponent } from './pages/registerpage/registerpage.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { InvestmentsComponent } from './pages/investments/investments.component';
import { PhysiqueComponent } from './pages/physique/physique.component';
import { TravelsComponent } from './pages/travels/travels.component';

const routes: Routes = [
	{ path: 'index', component: IndexComponent },
	{ path: 'register', component: RegisterpageComponent },
	{ path: 'landing', component: LandingpageComponent },
	{ path: 'investments', component: InvestmentsComponent },
	{ path: 'physique', component: PhysiqueComponent },
	{ path: 'travels', component: TravelsComponent },
	{ path: 'home', component: ProfilepageComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
	imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
