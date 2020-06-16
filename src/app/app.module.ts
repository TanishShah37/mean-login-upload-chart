import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { ImageUploadComponent } from './image-upload';
import { GraphPlotComponent } from './graph-plot';
import { Daterangepicker } from 'ng2-daterangepicker';;
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        ChartsModule,
        Daterangepicker,
        NgbModule    
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        ImageUploadComponent,
        GraphPlotComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})


export class AppModule { "allowSyntheticDefaultImports": true };