import { Component, OnInit } from '@angular/core';
import { version } from '../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  startYear = 2019;
  currentYear = new Date().getFullYear();
  version: { major: any; minor: any; patch: any; };
  copyrightPeriod = this.currentYear === this.startYear ? this.startYear : `${this.startYear} - ${this.currentYear}`;

  constructor() {
  }

  ngOnInit(): void {
    const v: string = version;
    console.log(version);
    const buildVersion = v.split('.');
    console.log(buildVersion);

    this.version = {
      major: buildVersion[0],
      minor: buildVersion[1],
      patch: buildVersion[2]
    };
  }
}
