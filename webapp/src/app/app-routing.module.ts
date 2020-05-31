import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from "./pages/home/home.component"
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactMeComponent } from './pages/contact-me/contact-me.component';
import { ProjectsComponent } from './pages/projects/projects.component';

const routes: Routes = [
	{ path: 'contact-me', component: ContactMeComponent },
	{ path: 'about-me', component: AboutMeComponent },
	{ path: 'projects', component: ProjectsComponent },
	{ path: 'home', component: HomeComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },	
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
