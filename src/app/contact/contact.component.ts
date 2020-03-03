import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactDetails = {
    name: 'Raul Schnelzer',
    mail: 'mail@raulschnelzer.de',
    phone: '+49 173 5227934'
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
