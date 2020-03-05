import { Component, OnInit } from '@angular/core';
import { ContactOptions } from '../contact/contact.component';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.css']
})
export class ImprintComponent implements OnInit {

  nameAdressOptions = new Set([ContactOptions.name, ContactOptions.address]);
  contactOptions = new Set([ContactOptions.directContact]);

  constructor() { }

  ngOnInit(): void {
  }

}
