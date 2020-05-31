import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//** angular material */
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MenuComponent } from './components/menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactMeComponent } from './pages/contact-me/contact-me.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { InfoComponent } from './pages/info/info.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NotFoundComponent,
		MenuComponent,
		AboutMeComponent,
		ContactMeComponent,
		ProjectsComponent,
		InfoComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatToolbarModule,
		MatIconModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
