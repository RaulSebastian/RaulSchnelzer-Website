import { Component, Input, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import Typewriter from 't-writer.js';

@Component({
  selector: 'app-header',
  template:
`<div class="header-wrapper">
  <div [class]="headerClass">
  <div style="display:flex">
  <div class="header-title-wrapper right">
    <span class="header-title" [style.color]="fontColor">
      {{ titlePrefix }}
    </span>
  </div>
  <div>
    <img [src]="logoSource" alt="logo" id="homeicon" [class]="logoClass" />
  </div>
  <div class="header-title-wrapper">
    <span class="header-title" [style.color]="fontColor">
      {{titleSufix}}
    </span>
  </div>
  </div>

  <div>
    <span
      class="header-subtitle"
      [style.color]="fontColor"
      #subtitleSpan>
    </span>
  </div>
</div>

<div class="header-menu-border">
  <div class="header-menu-separator"></div>
  <div class="header-menu-links">
    <a *ngFor="let nav of navigationItems"
      [style.color]="fontColor"
      [style.border-color]="fontColor"
      routerLink="{{nav.href}}"
      routerLinkActive="active"
    >{{nav.display}}</a>
  </div>
</div>

</div>`,
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, AfterViewInit {
  subtitles = [
    'Full Stack Development',
    'Solutions Architecture',
    'Distributed Systems',
    'Business Intelligence',
    'DevOps'];
  @ViewChild('subtitleSpan', { static: false }) subtitleHolder: ElementRef;
  @Input() fontColor: string;
  @Input() logoSource: string;
  @Input() logoClass = '';
  @Input() titlePrefix: string;
  @Input() titleSufix: string;
  @Input() backlight = false;
  @Input() navigationItems: [];

  headerClass = 'header-title-border';

  constructor() {
  }

  ngOnInit(): void {
    this.headerClass = this.backlight ? 'header-title-border header-title-backlight' : 'header-title-border';
  }

  ngAfterViewInit(): void {
    const target = this.subtitleHolder.nativeElement;
    const writer = new Typewriter(target, {
      loop: true,
      typeColor: this.fontColor,
      cursorColor: this.fontColor,
      animateCursor: true,
      blinkSpeed: 400,
      typeSpeed: 90,
      deleteSpeed: 40,
      typeSpeedMin: 65,
      typeSpeedMax: 115,
      deleteSpeedMin: 40,
      deleteSpeedMax: 90
    });
    this.subtitles.forEach(subtitle => {
      writer.type(subtitle).rest(7 * 1000).clear();
    });
    writer.start();
  }

}
