import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContactOptions } from '../contact/contact.component';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {

  nameAdressOptions = new Set([ContactOptions.name, ContactOptions.address]);
  contactOptions = new Set([ContactOptions.directContact]);

  constructor() { }

  @Output() closed = new EventEmitter();

  ngOnInit(): void {
  }

  public close(): void {
    this.closed.emit();
  }
}
