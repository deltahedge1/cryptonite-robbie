import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
declare let d3: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', '../../node_modules/nvd3/build/nv.d3.css']
})
export class AppComponent implements OnInit  {
  public alerts: Array<IAlert> = [];
  public title = 'Cryptonite';
  public awesomeThings = [];
  public dataHidden = true;
  public taxableIncome: number;
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
  public taxEntities = [
    {
      'name': 'individual',
      'tooltip': '',
      'disclaimer': `Generally, there will be no income tax or GST implications if you are not in business or carrying on an enterprise and you simply pay for goods or services in bitcoin (for example, acquiring personal goods or services on the internet using bitcoin).
      Where you use bitcoin to purchase goods or services for personal use or consumption, any capital gain or loss from disposal of the bitcoin will be disregarded (as a personal use asset) provided the cost of the bitcoin is $10,000 or less.
      https://www.ato.gov.au/General/Gen/Tax-treatment-of-crypto-currencies-in-Australia---specifically-bitcoin/
      `
    },
    {
      'name': 'trust',
      'tooltip': '',
      'disclaimer': `Disposal of a trust asset (or another capital gains tax event) is likely to result in a capital gain or loss for the trust (unless a beneficiary is absolutely entitled to the asset).
      Capital gains and losses are taken into account in working out the trust's net capital gain or net capital loss for an income year:
      A net capital gain is included in the trust's net income.
      A net capital loss is carried forward and offset against the trust's future capital gains.
      As part of the net income of a trust, the net capital gain for the year is then allocated proportionately to beneficiaries based on their entitlements to trust income – unless:
      *there is a beneficiary that is specifically entitled to the capital gain, or
      *the trustee (of a resident trust) chooses to be taxed on a capital gain.
      This choice can be made provided all or part of an amount relating to the gain has not been paid to, or otherwise allocated for the benefit of, a beneficiary during or within two months of the end of the income year. This rule allows the trustee to choose to pay tax on behalf of a beneficiary who doesn't immediately benefit from the gain.
      If there is no beneficiary entitled to income (or specifically entitled to the capital gain) the trustee is taxed on the capital gain.
      Where the trustee is taxed on trust net income at the top marginal rate, they are not entitled to the CGT discount on the gain.
      https://www.ato.gov.au/General/Trusts/Trust-capital-gains-and-losses/
      `
    },
    {
      'name': 'fund',
      'tooltip': '',
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
      For foreign resident individuals, the 50% discount is removed or reduced for capital gains made after 8 May 2012 on taxable Australian property.
      https://www.ato.gov.au/General/Capital-gains-tax/Working-out-your-capital-gain-or-loss/Working-out-your-capital-gain/The-discount-method-of-calculating-your-capital-gain/#Eligibility
      `
    },
    {
      'name': 'SMSF',
      'tooltip': '',
      'disclaimer': `Your SMSF’s assessable income includes any net capital gains. Complying SMSFs are entitled to a CGT discount of one-third if the relevant asset had been owned for at least 12 months.
      A net capital gain is:
      the total capital gain for the year
      less
      total capital losses for that year and any unapplied capital losses from earlier years
      less
      the CGT discount and any other concessions.
      A capital loss (for example, losses on the sale of commercial premises) is not an allowable deduction and is only able to be offset against capital gains. If capital losses are greater than capital gains in a financial year, they must be carried forward to be offset against future capital gains.
      https://www.ato.gov.au/Super/Self-managed-super-funds/Investing/Tax-on-income/Capital-gains/
      `
    },
    {
      'name': 'company',
      'tooltip': '',
      'disclaimer': ''
    }
  ]
  setMessage(disclaim) {
    this.disclaimer = disclaim;
  }
  generatedData: Object;
  private config = {
    'headers': {
      'Content-Type': 'Application/JSON',
      'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiI4MThmYjdlNi03MDc0LTQ3MzAtOGJkOC1jYmE2NzU1MzUyODAifQ.zfdgQ-CeDSjXp6zYFEARlPjqi4BIuuJvT7Cndi1LbsI'
    }
  };
  public data: any;
  constructor(private http: HttpClient) {
    this.Math = Math;
  }
  ngOnInit() {
    // initialise an object to store randomly generated transactions
    // this.generatedData = {'data': []};
    // generate random transaction history for eth, xbt and bch
    // this.generateTransactions();
  }
  // alert logic
  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
  public addAlert() {
    this.alerts.push({id: 1, type: 'success', message: 'Successfully generated transaction history.'});
  }
  generateTransactions() {
    this.generatedData['data'] = [];
    this.generateData('Eth');
    this.generateData('Xbt');
    this.generateData('Bch');
    this.addAlert();
  }
  taxView() {
    this.taxActive = true;
  }
  accountView() {
    this.taxActive = false;
  }
  switch(currency) {
    this[currency] = !this[currency];
  }
  showData() {
    return this.http.post('http://cryptonitedemo.herokuapp.com/api/v1/cgt', this.generatedData, this.config)
    .subscribe(data => {
      console.log(data);
      this.taxableIncome = data['cumulativeTotal'];
      this.ethTotal = data['taxEvents']['Eth']['Total'];
      this.xbtTotal = data['taxEvents']['Xbt']['Total'];
      this.bchTotal = data['taxEvents']['Bch']['Total'];
      this.ethBar = this.ethTotal < 0 ? 'danger' : 'default';
      this.xbtBar = this.xbtTotal < 0 ? 'danger' : 'default';
      this.bchBar = this.bchTotal < 0 ? 'danger' : 'default';
      this.processed = true;
    });
  }
  generateData(currency) {
    const rounds = 80 + Math.ceil(Math.random() * 30);
    for (let i = 0; i < rounds; i++) {
      const avgBuyPrice = Math.ceil(Math.random() * 1000);
      const randVolume = Math.ceil(Math.random() * 100);
      const buyTime = new Date(+(new Date()) - Math.floor(Math.random() * 30000000000));
      const saleTime = new Date(+buyTime + Math.floor(Math.random() * 10000000000));
      // console.log(this.generatedData);
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
        'CreatedTimestampUtc': buyTime.toISOString(),
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
}
export interface IAlert {
  id: number;
  type: string;
  message: string;
}
