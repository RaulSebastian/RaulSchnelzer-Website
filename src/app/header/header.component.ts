import { Component, Input, ViewChild, OnInit, AfterViewInit, ElementRef, QueryList } from '@angular/core';
import Typewriter from 't-writer.js';

@Component({
  selector: 'app-header',
  template: `<div class="header-title-border">
  <div>
    <span class="header-title" [style.color]="fontColor">{{
      titlePrefix
    }}</span>
    <img [src]="logoSource" id="homeicon" />
    <span class="header-title" [style.color]="fontColor">{{titleSufix}}</span>
  </div>

  <div>
  <span
    class="header-subtitle"
    [style.color]="fontColor"
    #subtitleSpan
  ></span>
  </div>
</div>`,
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements AfterViewInit {
  subtitles = [
    'Full Stack Development',
    'Solutions Architecture',
    'Distributed Systems',
    'Business Intelligence',
    'DevOps'];
  @ViewChild('subtitleSpan', { static: false }) subtitleHolder: ElementRef;
  @Input() fontColor: string;
  @Input() logoSource: string;
  @Input() titlePrefix: string;
  @Input() titleSufix: string;

  constructor() {
  }

  ngAfterViewInit(): void {
    const target = this.subtitleHolder.nativeElement;
    // const target = window.document.querySelector('.header-subtitle');
    console.log(target);
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
