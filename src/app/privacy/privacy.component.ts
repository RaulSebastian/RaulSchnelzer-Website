import { Component, OnInit } from '@angular/core';
import { ContactOptions } from '../contact/contact.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  nameAdressOptions = new Set([ContactOptions.name, ContactOptions.address]);

  constructor() { }

  ngOnInit(): void {
  }

}
