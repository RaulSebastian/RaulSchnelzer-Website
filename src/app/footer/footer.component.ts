import { Component, OnInit } from '@angular/core';
import { version } from '../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  startYear = 2019;
  currentYear = new Date().getFullYear().toString();
  version: { major: any; minor: any; patch: any; };

  constructor() {
  }

  ngOnInit(): void {
    const buildVersion = version.split('.');

    this.version = {
      major: buildVersion[0],
      minor: buildVersion[1],
      patch: buildVersion[2]
    };
  }
}
