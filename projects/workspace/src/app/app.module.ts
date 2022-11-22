import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SerializerModule } from 'projects/kflow/src/component/k-editor/service/serializer.module';
import {KEditorModule} from 'projects/kflow/src/component/k-editor/k-editor.module';




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
