import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NvD3Module } from 'ng2-nvd3';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import 'd3';
import 'nvd3';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { BtcmarketsComponent } from './btcmarkets/btcmarkets.component';
import { TaxComponent } from './tax/tax.component';
import { MainComponent } from './main/main.component';
import { MinusSignToParens } from './minusSignToParens.pipe';
// @dev This module imports, registers and exposes all of the components and modules in the app.
// If you're creating a new route or module, make sure to import it with the same syntax as above
// and register it below, so angular knows it exists.
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    BtcmarketsComponent,
    TaxComponent,
    MainComponent,
    MinusSignToParens
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AlertModule.forRoot(),
    NgbModule.forRoot(),
    NvD3Module,
    AppRoutingModule,
    FormsModule
  ],
  exports : [AppComponent],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
