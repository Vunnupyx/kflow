import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KEditorModule, SerializerModule } from '@vunnupyx/kflow';

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
