import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KEditorModule } from 'projects/ng-flowchart/src/component/k-editor/k-editor.module';
import { SerializerModule } from 'projects/ng-flowchart/src/component/k-editor/service/serializer.module';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KEditorModule,
    SerializerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
