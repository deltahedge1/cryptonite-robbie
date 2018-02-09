import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



declare let d3: any;


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss', '../../../node_modules/nvd3/build/nv.d3.css']
})



export class LayoutComponent {

}
