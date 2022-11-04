import { NgModule } from '@angular/core';
import { SerializerPipe } from './serializer.pipe';


@NgModule({
    declarations: [SerializerPipe],
    providers: [SerializerPipe],
})
export class SerializerModule {
}
