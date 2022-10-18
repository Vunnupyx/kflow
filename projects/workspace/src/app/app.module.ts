import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KEditorModule } from '../../../ng-flowchart/src/component/k-editor/k-editor.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
