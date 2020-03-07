import { Component, OnInit, Input } from '@angular/core';
import { ContactOptions } from '../contact/contact.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  nameAdressOptions = new Set([ContactOptions.name, ContactOptions.address]);
  resposibilityMail = 'privacy@raulschnelzer.de';
  modifiedDate = '7. March 2020';

  @Input() isProduction = false;

  constructor() { }

  ngOnInit(): void {
  }

}
