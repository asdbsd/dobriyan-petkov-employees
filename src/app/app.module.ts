import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { ProjectPairsComponent } from './project-pairs/project-pairs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { ErrorComponent } from './error/error.component'

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    ProjectPairsComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxCsvParserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
