import { Component, OnInit } from '@angular/core';
import { version } from '../../../package.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  startYear = 2019;
  currentYear = new Date().getFullYear();
  version: string = version;
  copyrightPeriod = this.currentYear === this.startYear ? this.startYear : `${this.startYear} - ${this.currentYear}`;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
}
