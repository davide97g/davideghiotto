import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { PagesModule } from './pages/pages.module';

import { IndexComponent } from './pages/index/index.component';
import { ProfilepageComponent } from './pages/profilepage/profilepage.component';
import { RegisterpageComponent } from './pages/registerpage/registerpage.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { APP_BASE_HREF } from '@angular/common';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
@NgModule({
	declarations: [
		AppComponent,
		TopBarComponent,
		FooterComponent,
		ProgressBarComponent,
		// IndexComponent,
		// ProfilepageComponent,
		// RegisterpageComponent,
		// LandingpageComponent
	],
	imports: [
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		RouterModule,
		AppRoutingModule,
		// BsDropdownModule.forRoot(),
		// ProgressbarModule.forRoot(),
		// TooltipModule.forRoot(),
		CollapseModule.forRoot(),
		// TabsModule.forRoot(),
		PagesModule,
		// PaginationModule.forRoot(),
		// AlertModule.forRoot(),
		// BsDatepickerModule.forRoot(),
		// CarouselModule.forRoot(),
		// ModalModule.forRoot()
		MatSnackBarModule,
		MatProgressBarModule,
	],
	providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
	bootstrap: [AppComponent],
})
export class AppModule {}
