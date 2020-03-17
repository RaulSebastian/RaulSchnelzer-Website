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

  constructor() {
  }

  @Input() contactOptions: Set<ContactOptions> = new Set<ContactOptions>();

  contactDetails = {
    name: 'Raul Schnelzer',
    mail: 'mail@raulschnelzer.de',
    phone: '+49 173 5227934'
  };

  onlineContact = [
    {
      source: 'LinkedIn',
      image: '../../assets/LinkedInIcon.png',
      class: 'contact-icon hue-rotate',
      size: '10vmin',
      link: 'https://linkedin.com/in/raul-schnelzer'
    },
    {
      source: 'Xing',
      image: '../../assets/XingIcon.png',
      class: 'contact-icon',
      size: '9vmin',
      link: 'https://www.xing.com/profile/Raul_Schnelzer/portfolio'
    },
    {
      source: 'Stack Overflow',
      image: '../../assets/StackOverflowIcon.png',
      class: 'contact-icon reinverted',
      size: '10vmin',
      link: 'https://stackoverflow.com/users/story/3205951/'
    },
    {
      source: 'Github',
      image: '../../assets/GitHubIcon.png',
      class: 'contact-icon inverted',
      size: '7vmin',
      link: 'https://github.com/RaulSebastian'
    },
    {
      source: 'Whatsapp',
      image: '../../assets/WhatsAppIcon.png',
      class: 'contact-icon',
      size: '10vmin',
      link: 'https://api.whatsapp.com/send?phone=+491735227934'
    }
  ];

  public showName = false;
  public showAddress = false;
  public showDirectContact = false;
  public showSocialMedia = false;

  ngOnInit(): void {
    this.showName = this.contactOptions.has(ContactOptions.name);
    this.showAddress = this.contactOptions.has(ContactOptions.address);
    this.showDirectContact = this.contactOptions.has(ContactOptions.directContact);
    this.showSocialMedia = this.contactOptions.has(ContactOptions.socialMedia);
  }
}
