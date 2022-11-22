import { NgModule } from '@angular/core';
import { SerializerService } from './serializer.service';
import { DeserializerService } from './deserializer.service';


@NgModule({
    providers: [DeserializerService, SerializerService],
})
export class SerializerModule {
}
