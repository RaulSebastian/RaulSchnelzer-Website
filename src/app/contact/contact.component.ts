import { Component, OnInit, Input } from '@angular/core';

export enum ContactOptions {
  name,
  address,
  directContact,
  socialMedia
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Input() contactOptions: Set<ContactOptions> = new Set<ContactOptions>();

  contactDetails = {
    name: 'Raul Schnelzer',
    mail: 'mail@raulschnelzer.de',
    phone: '+49 173 5227934'
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  public showName = (): boolean => this.contactOptions.has(ContactOptions.name);
  public showAddress = (): boolean => this.contactOptions.has(ContactOptions.address);
  public showDirectContact = (): boolean => this.contactOptions.has(ContactOptions.directContact);
  public showSocialMedia = (): boolean => this.contactOptions.has(ContactOptions.socialMedia);

}
