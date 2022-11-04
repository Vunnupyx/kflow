import { NgModule } from '@angular/core';
import { SerializerPipe } from './serializer.pipe';


@NgModule({
    declarations: [SerializerPipe],
    providers: [SerializerPipe],
    exports: [SerializerPipe]
})
export class SerializerModule {
}
