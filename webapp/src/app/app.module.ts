import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { initializeApp } from 'firebase/app';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { PagesModule } from './pages/pages.module';

import { APP_BASE_HREF } from '@angular/common';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

const firebaseConfig = {
	apiKey: 'AIzaSyDu6znSiDhICU9xdVAASJe2SDB29H1ZeTE',
	authDomain: 'davide-ghiotto.firebaseapp.com',
	databaseURL: 'https://davide-ghiotto.firebaseio.com',
	projectId: 'davide-ghiotto',
	storageBucket: 'davide-ghiotto.appspot.com',
	messagingSenderId: '970217944687',
	appId: '1:970217944687:web:0253824c28af5177adbf9a',
	measurementId: 'G-EL9K6LFBBL',
};

// Initialize Firebase
initializeApp(firebaseConfig);

@NgModule({
	declarations: [AppComponent, TopBarComponent, FooterComponent, ProgressBarComponent],
	imports: [
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		RouterModule,
		AppRoutingModule,
		CollapseModule.forRoot(),
		PagesModule,
		MatSnackBarModule,
		MatProgressBarModule,
	],
	providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
	bootstrap: [AppComponent],
})
export class AppModule {}
