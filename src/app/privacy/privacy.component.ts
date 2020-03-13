import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactOptions } from '../contact/contact.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  nameAdressOptions = new Set([ContactOptions.name, ContactOptions.address]);
  resposibilityMail = 'privacy@raulschnelzer.de';

  @Input() isProduction = false;
  @Input() modifiedDate = new Date();
  @Output() closed = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public getModifiedDate(): string {
    return this.modifiedDate.toLocaleDateString('en-US',
      { day: 'numeric', month: 'long', year: 'numeric' });
  }

  public close(): void {
    this.closed.emit();
  }
}
