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

  onlineContact = [
    {
      source: 'LinkedIn',
      image: '../../assets/LinkedInIcon.png',
      size: '6vh',
      link: 'https://linkedin.com/in/raul-schnelzer'
    },
    {
      source: 'Xing',
      image: '../../assets/XingIcon.png',
      size: '5.5vh',
      link: 'https://www.xing.com/profile/Raul_Schnelzer/portfolio'
    },
    {
      source: 'Stack Overflow',
      image: '../../assets/StackOverflowIcon.png',
      size: '9vh',
      link: 'https://stackoverflow.com/users/story/3205951/'
    },
    {
      source: 'Github',
      image: '../../assets/GitHubIcon.png',
      size: '6vh',
      link: 'https://github.com/RaulSebastian'
    },
    {
      source: 'Whatsapp',
      image: '../../assets/WhatsAppIcon.png',
      size: '7vh',
      link: 'https://api.whatsapp.com/send?phone=+491735227934'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  public showName = (): boolean => this.contactOptions.has(ContactOptions.name);
  public showAddress = (): boolean => this.contactOptions.has(ContactOptions.address);
  public showDirectContact = (): boolean => this.contactOptions.has(ContactOptions.directContact);
  public showSocialMedia = (): boolean => this.contactOptions.has(ContactOptions.socialMedia);

}
