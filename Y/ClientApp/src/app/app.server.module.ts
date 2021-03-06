import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule
} from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module'; 
import { CssFlexLayoutModule } from 'angular-css-flex-layout';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    CssFlexLayoutModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
