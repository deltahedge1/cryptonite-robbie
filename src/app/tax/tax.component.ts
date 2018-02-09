/*

  @dev This is the main component for controlling the state for the tax view.
  This controls the information interpolated by the tax.component.html file.

  It also reads a hardcoded JSON file which is a direct response from the API with some generated data --
  meaning a static version of the analysis is available on the site even if the API is down or there's
  no internet access. Feel free to update or change this file if the API response updates.
  (Retrieved in getJSON method).

  Declarations of class properties should have appropriate privacy modifiers; public means it's available
  to the HTML, whereas private means it's only used internally by the component.


*/

import { Component, OnInit, style, state, animate, transition, trigger } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
const now = new Date();

// @dev selector: 'app-tax' means you can create an instance of this component in any page simply by writing
// <app-tax></app-tax>
@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})


export class TaxComponent implements OnInit {

  // Declare all the properties we'll need to use. Default value is always undefined in typescript.

  yearSelectedInfo: any[];
  public limitView: any;
  public isViewLimited = false;
  public dateYears = [];
  public backupData: any;
  public alerts: Array<IAlert> = [];
  public title = 'Cryptonite';
  public awesomeThings = [];
  public dataHidden = true;
  public ethTotal: number;
  public xbtTotal: number;
  public bchTotal: number;
  public taxActive = false;
  public processed = false;
  public disclaimer;
  public eth = false;
  public xbt = false;
  public bch = false;
  public Math: any;
  public ethBar = 'default';
  public xbtBar = 'default';
  public bchBar = 'default';
  public currentEntity: Object;
  public data: any;
  public allTransactions = [];
  public analysis: any;
  public loadingData = false;
  public postBody: any;
  public selectedViewYear: {};
  private generatedData: Object;

  // Defining tax entity information shown as the first step for the user.
  // Should match {cryptoniteapi}/api/entity-types.

  public taxEntities = [
    {
      'name': 'Individual',
      'apiName': 'individual',
      'tooltip': 'Select this option if you\'re an individual or sole trader.',
      'disclaimer': `Generally, there will be no income tax or GST implications if you are not in business or carrying on an enterprise and you simply pay for goods or services in bitcoin (for example, acquiring personal goods or services on the internet using bitcoin).
      Where you use bitcoin to purchase goods or services for personal use or consumption, any capital gain or loss from disposal of the bitcoin will be disregarded (as a personal use asset) provided the cost of the bitcoin is $10,000 or less.`,
      'url': 'https://www.ato.gov.au/General/Gen/Tax-treatment-of-crypto-currencies-in-Australia---specifically-bitcoin/',
      'discount': '50%'
    },
    {
      'name': 'Trust',
      'apiName': 'Trust',
      'tooltip': 'Select this if this portfolio represents assets held on trust, managed on behalf of beneficiaries.',
      'disclaimer': `Disposal of a trust asset (or another capital gains tax event) is likely to result in a capital gain or loss for the trust (unless a beneficiary is absolutely entitled to the asset).
      Capital gains and losses are taken into account in working out the trust's net capital gain or net capital loss for an income year:
      A net capital gain is included in the trust's net income.
      A net capital loss is carried forward and offset against the trust's future capital gains.
      As part of the net income of a trust, the net capital gain for the year is then allocated proportionately to beneficiaries based on their entitlements to trust income – unless:
      *there is a beneficiary that is specifically entitled to the capital gain, or
      *the trustee (of a resident trust) chooses to be taxed on a capital gain.
      This choice can be made provided all or part of an amount relating to the gain has not been paid to, or otherwise allocated for the benefit of, a beneficiary during or within two months of the end of the income year. This rule allows the trustee to choose to pay tax on behalf of a beneficiary who doesn't immediately benefit from the gain.
      If there is no beneficiary entitled to income (or specifically entitled to the capital gain) the trustee is taxed on the capital gain.
      Where the trustee is taxed on trust net income at the top marginal rate, they are not entitled to the CGT discount on the gain.`,
      'url': 'https://www.ato.gov.au/General/Trusts/Trust-capital-gains-and-losses/',
      'discount': '50%'
    },
    {
      'name': 'Fund',
      'apiName': 'fund',
      'tooltip': 'Select this option if you\'re investing via a fund you own, e.g. a super fund.',
      'disclaimer': `You can use the discount method to calculate your capital gain if:
      you're an individual, trust or complying super fund
      the CGT event happened to your asset after 11.45am (by legal time in the ACT) on 21 September 1999
      you acquired the asset at least 12 months before the CGT event
      you did not choose to use the indexation method.
      Generally, the discount method does not apply to companies, although it can apply to a limited number of capital gains made by life insurance companies.
      You can use the discount method to work out your capital gain from a property if:
      you acquire a property and construct a building or make improvements to it that are not separate assets
      you owned the property for at least 12 months (even if you did not construct the new building or improvements more than 12 months before the CGT event happened).
      For foreign resident individuals, the 50% discount is removed or reduced on capital gains made after 8 May 2012 – see CGT discount for foreign resident individuals.
      For foreign resident individuals, the 50% discount is removed or reduced for capital gains made after 8 May 2012 on taxable Australian property.`,
      'url': 'https://www.ato.gov.au/General/Capital-gains-tax/Working-out-your-capital-gain-or-loss/Working-out-your-capital-gain/The-discount-method-of-calculating-your-capital-gain/#Eligibility',
      'discount': '33.33%'
    },
    {
      'name': 'SMSF',
      'apiName': 'SMSF',
      'tooltip': 'Select this option if your account is operated in a self-managed super fund. An SMSF is a private superannuation fund regulated by the ATO which you manage yourself. ',
      'disclaimer': `Your SMSF’s assessable income includes any net capital gains. Complying SMSFs are entitled to a CGT discount of one-third if the relevant asset had been owned for at least 12 months.
      A net capital gain is:
      the total capital gain for the year less
      total capital losses for that year and any unapplied capital losses from earlier years less
      the CGT discount and any other concessions.
      A capital loss (for example, losses on the sale of commercial premises) is not an allowable deduction and is only able to be offset against capital gains. If capital losses are greater than capital gains in a financial year, they must be carried forward to be offset against future capital gains.
      `,
      'url': 'https://www.ato.gov.au/Super/Self-managed-super-funds/Investing/Tax-on-income/Capital-gains/',
      'discount': '33.33%'
    },
    {
      'name': 'Company',
      'apiName': 'company',
      'tooltip': 'Select this option if your porfolio is owned by a registered Australian Company.',
      'disclaimer': 'No CGT discount is available for companies.',
      'url': 'https://www.ato.gov.au/General/Capital-gains-tax/Small-business-CGT-concessions/',
      'discount': 'No Discount'
    }
  ];

  constructor(private http: HttpClient) {
    // Exposes the Math JS Object so we can use it for processing in the HTML.
    this.Math = Math;
    // Fetches the backup JSON response. Statically served asset -- this is NOT a request to the server.
    this.getJSON().subscribe(data => {
      this.backupData = data;
    });
  }
  // Powers selection of tax entity in first row of tax component. Called in HTML.
  selectEntity(entity) {
    this.disclaimer = entity.disclaimer;
    this.currentEntity = entity;
  }

  // HTTP config for Cryptonite API.
  // Currently unused, and explicitly defined in the server request (/server/index.js)

  private config = {
    'headers': {
      'Content-Type': 'Application/JSON',
      'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiI4MThmYjdlNi03MDc0LTQ3MzAtOGJkOC1jYmE2NzU1MzUyODAifQ.zfdgQ-CeDSjXp6zYFEARlPjqi4BIuuJvT7Cndi1LbsI'
    }
  };

  // Angular calls this method after creating the component (a constructor may be too early).
  ngOnInit() {
    // Get current year for date selection
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 4; i <= currentYear; i++) {
      this.dateYears.push({'year': i, 'selected': false, 'info': {}});
    }
    // Initialise an object to store randomly generated transactions
    this.generatedData = {'data': []};
    // Generate random transaction history for ETH (Ethereum), XBT (Bitcoin) and BCH (Bitcoin Cash).
    // These are really just names; the generation process is otherwise identical.
    this.generateTransactions();
  }

  // @dev Change response1.json to any json file you like if it exists in
  // /assets/json to use that file as the backup data. All files and folders in the assets folder are
  // statically served and therefore publicly accessible.

  public getJSON(): Observable<any> {
    return this.http.get('/assets/json/response1.json')
    .map((res: any) => res);
  }

  // Alert logic (ng Bootstrap UI)
  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
  public addAlert() {
    this.alerts.push({id: 1, type: 'success', message: 'Successfully generated transaction history.'});
  }
  // Calls the generateData method for each coin and alerts the front-end.
  generateTransactions() {
    this.generatedData['data'] = [];
    this.generateData('Eth');
    this.generateData('Xbt');
    this.generateData('Bch');
    this.addAlert();
  }
  // Controls whether you can see the tax analysis component.
  // Will be toggled on/off by links in the HTMl -- as simple as writing
  // <button (click)="taxView()">Tax Analysis</button>

  taxView() {
    this.taxActive = true;
  }
  // Similar logic, but for the "accountView" (the default scraped view of the IR/BTCMarkets site)
  accountView() {
    this.taxActive = false;
  }

  // @dev Main analysis function - passes generated data, tax entity status and selected years
  // to api to be analysed.
  // Generates an observable object which passes response to frontend
  // or uses a backup JSON object if unavailable.
  showData() {
    // Old API v1:  http://cryptonitedemo.herokuapp.com/api/v1/cgt

    // Shows the CSS spinner.
    this.loadingData = true;
    // Resets the tax summary year currently selected (shown at the bottom of the page) in case they have 
    // already analysed.
    this.selectedViewYear = null;
    this.allTransactions = [];
    this.postBody = {};
    // Default the tax entity type to "individual" if nothing has been selected.
    const currEntityType = this.currentEntity ? this.currentEntity['apiName'] : 'individual'; 
    this.generatedData['entityType'] = currEntityType;
    return this.http.post(environment.apiHost + '/api/cgt', this.generatedData, this.config)
    .subscribe(
      // POST request was successful. Analyse it and pass it to the HTML.
      data => {
        this.yearSelectedInfo = [];
        // Loop through each tax year object returned. Filter by if the year matches the ones selected by user.
        for (const year of Object.keys(data['taxYear'])) {
          const yearInScope = this.dateYears.some(function(yearObj) {
            if (yearObj['year'] === +year && yearObj['selected']) {
              return true;
            }
          });
          // If year is in scope, push tax information into our local array of years.
          if (yearInScope) {
            this.yearSelectedInfo.push({
              'year': year,
              'cgtGainsNoDiscount': data['taxYear'][year]['cgtGainsNoDiscount']['subTotal'],
              'cgtGainsDiscount': data['taxYear'][year]['cgtGainsDiscount']['subTotal'],
              'cgtLosses': data['taxYear'][year]['cgtLosses']['subTotal'],
              'total': data['taxYear'][year]['IncomeTaxOrLoss']
            });
            // For each year, push all the transactions to display in a table
            for (const key of Object.keys(data['taxYear'][year])) {
              if (key !== 'IncomeTaxOrLoss') {
                data['taxYear'][year][key]['cgtEvents'].forEach(element => {
                  if (element.gainOrLoss !== 0) {
                    this.allTransactions.push(element);
                  }
                });
              }
            }
          }
        }
        // Sort transactions by time.
        this.allTransactions.sort(function (a, b) {
          const start = +new Date(b.DisposalTimeStampUtc);
          const elapsed = +new Date(a.DisposalTimeStampUtc) - start;
          return elapsed;
        });
        this.loadingData = false;
        this.processed = true;
      }, // this function is called if the POST request errors, and handles the fallback JSON file
      err => {
        const data = this.backupData;
        this.yearSelectedInfo = [];
        // this.selectedViewYear;
        for (const year of Object.keys(data['taxYear'])) {
          const yearInScope = this.dateYears.some(function(yearObj) {
            if (yearObj['year'] === +year && yearObj['selected']) {
              return true;
            }
          });
          if (yearInScope) {
            this.yearSelectedInfo.push({
              'year': year,
              'cgtGainsNoDiscount': data['taxYear'][year]['cgtGainsNoDiscount']['subTotal'],
              'cgtGainsDiscount': data['taxYear'][year]['cgtGainsDiscount']['subTotal'],
              'cgtLosses': data['taxYear'][year]['cgtLosses']['subTotal'],
              'total': data['taxYear'][year]['IncomeTaxOrLoss']
            });
            for (const key of Object.keys(data['taxYear'][year])) {
              if (key !== 'IncomeTaxOrLoss') {
                data['taxYear'][year][key]['cgtEvents'].forEach(element => {
                  if (element.gainOrLoss !== 0) {
                    this.allTransactions.push(element);
                  }
                });
              }
            }
          }
        }
        this.allTransactions.sort(function (a, b) {
          const start = +new Date(b.date);
          const elapsed = +new Date() - start;
          return elapsed;
        });
        this.loadingData = false;
        this.processed = true;
      });
    }
    // Auto generate transactions to send to the API.
    generateData(currency) {
      const rounds = 80 + Math.ceil(Math.random() * 30);
      for (let i = 0; i < rounds; i++) {
        const avgBuyPrice = Math.ceil(Math.random() * 1000);
        const randVolume = Math.ceil(Math.random() * 100);
        const buyTime = new Date(+(new Date()) - 20000000000 - Math.floor(Math.random() * 40000000000));
        const saleTime = new Date(+(new Date()) - Math.floor(Math.random() * 20000000000));
        this.generatedData['data'].push({
          'AvgPrice': avgBuyPrice,
          'CreatedTimestampUtc': buyTime.toISOString(),
          'FeePercent': 0.005,
          'OrderGuid': '5c8885cd-5384-4e05-b397-9f5119353e10',
          'OrderType': 'MarketBid',
          'Outstanding': 0,
          'Price': 'null',
          'PrimaryCurrencyCode': currency,
          'SecondaryCurrencyCode': 'Aud',
          'Status': 'Filled',
          'Value': 17.47,
          'Volume': randVolume
        });
        this.generatedData['data'].push({
          'AvgPrice': avgBuyPrice * (Math.random() + 0.5),
          'CreatedTimestampUtc': saleTime.toISOString(),
          'FeePercent': 0.005,
          'OrderGuid': '5c8885cd-5384-4e05-b397-9f5119353e10',
          'OrderType': 'MarketOffer',
          'Outstanding': 0,
          'Price': 'null',
          'PrimaryCurrencyCode': currency,
          'SecondaryCurrencyCode': 'Aud',
          'Status': 'Filled',
          'Value': 17.47,
          'Volume': randVolume
        });
      }
    }
    public switchCoinView(token) {
      this.isViewLimited = true;
      this.limitView = token;
    }
    public allView() {
      this.isViewLimited = false;
      this.limitView = '';
    }
    public getLongTokenName(token) {
      return {
        'Eth': 'Ethereum',
        'Xbt': 'Bitcoin',
        'Bch': 'Bitcoin Cash'
      }[token];
    }
  }
  export interface IAlert {
    id: number;
    type: string;
    message: string;
  }
