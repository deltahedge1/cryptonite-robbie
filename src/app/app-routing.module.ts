import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BtcmarketsComponent } from './btcmarkets/btcmarkets.component';
import {enableProdMode} from '@angular/core';
import { MainComponent } from './main/main.component';

const routes = [
  { path: '', component: MainComponent },
  { path: 'independent-reserve', component: AppComponent},
  { path: 'btcmarkets', component: BtcmarketsComponent },
  { path: '**', component: AppComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
