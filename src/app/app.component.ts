import { Component, HostListener, Inject, NgModule, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from './services/window.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'Raul Schnelzer';
  titlePrefix = 'Raul';
  titleSufix = 'Schnelzer';
  overlayHeight = 80;
  overlayFontColor = 'white'; // TODO: more elegant solution to pass styles onto child components?
  headerFontColor = '#444444';
  overlayLogoSrc = 'assets/RS_logo_White400.png';
  headerLogoSrc = 'assets/RS_logo_Solar400.png';
  creativityIntro = 'font-size: 30vw;padding:30vh 0 0 0;';
  creativityOutro = 'font-size: 5vw;padding:30vh 0 0 0;';
  currentYear = new Date().getFullYear();

  servicesOffered = [
    { description: 'Tailor-made Software Development' },
    { description: 'Solutions Architecture' },
    { description: 'Enterprise Integration' },
    { description: 'Coding Reviews' }
  ];
  certificates = [
    {
      name: 'Microsoft Certified: Azure Fundamentals',
      icon: 'https://images.youracclaim.com/size/340x340/images/6a254dad-77e5-4e71-8049-94e5c7a15981/azure-fundamentals-600x600.png',
      issuer: 'Microsoft',
      validFrom: 'Jan 2020',
      validUntil: 'No Expiration Date',
      link: 'https://www.youracclaim.com/badges/1d7f7742-a5d5-468c-b6b8-4eecdb2726a2/linked_in_profile'
    },
    {
      name: 'Professional Scrum Developer',
      icon: 'https://static.scrum.org/web/badges/badge-psdi.svg',
      issuer: 'Scrum.org', validFrom: 'Jul 2019', validUntil: 'No Expiration Date',
      link: 'https://www.scrum.org/certificates/428766'
    },
    {
      name: 'Google Analytics Individual Qualification',
      icon: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
      issuer: 'Google',
      validFrom: 'Jun 2019',
      validUntil: 'Jun 2020',
      link: 'https://skillshop.exceedlms.com/student/award/34095694'
    },
    {
      name: 'SOA Done Right 2018 - DACH',
      icon: 'https://particular.net/images/blog/logo-og-img.png',
      issuer: 'Particular Software',
      validFrom: 'Dec 2018',
      validUntil: 'No Expiration Date',
      link: 'https://www.credential.net/p33cqkid'
    },
  ];

  skillsets = [
    {
      category: 'Methodologies', skills: [
        'Agile', 'Scrum', 'Kanban', 'Extreme Programming', 'DevOps',
        'Pair Programming', 'RAD', 'TDD', 'BDD', 'Iterative Development',
        'Requirements Engeneering']
    },
    {
      category: 'Architecture', skills: [
        'Microservices', 'N-Tier', 'MV*', 'Onion', 'Cloud first', 'RESTful'
      ]
    },
    {
      category: 'Paradigms', skills: [
        'OOP', 'Functional', 'Event-Driven'
      ]
    },
    {
      category: 'ProgrammingLanguages', skills: [
        'C#', 'T-SQL', 'TypeScript', 'Python', 'Dart'
      ]
    },
    {
      category: 'Frameworks', skills: [
        '.Net Core', 'Angular', 'Blazor', 'Aurelia', 'ASP.Net Core', 'NServiceBus', 'Node.js',
        'WPF', 'Akka.Net'
      ]
    },
    {
      category: 'Tools', skills: [
        'Visual Studio', 'VS Code', 'Jetbrains Toolbox', 'Adobe Photoshop', 'Affinity Designer',
        'Affinity Photo', 'MS BI Stack'
      ]
    },
    {
      category: 'DBMS', skills: [
        'SQL Server 2008R2 - 2019', 'RavenDB', 'MongoDB', 'CosmosDB', 'MySql', 'Oracle', 'EventStore'
      ]
    },
    {
      category: 'Platforms', skills: [
        'K8s', 'Docker', 'SharePoint'
      ]
    },
    {
      category: 'Misc', skills: [
        'Azure', 'Distributed Systems', 'CI/CD', 'Git', 'TFS VC'
      ]
    }
  ];

  @ViewChild('aboutContent', { static: false }) aboutContent: ElementRef;
  @ViewChild('servicesContent', { static: false }) servicesContent: ElementRef;
  @ViewChild('certsContent', { static: false }) certsContent: ElementRef;
  @ViewChild('skillsContent', { static: false }) skillsContent: ElementRef;
  @ViewChild('contactContent', { static: false }) contactContent: ElementRef;

  private offset = 0;
  private windowHeight: number;
  private windowWidth: number;
  private sectionsObserved: Array<ElementRef>;
  private creativityIntroFontSize = 0;
  private creativityOutroFontSize = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {
    this.windowHeight = this.window.outerHeight;
    this.windowWidth = this.window.outerWidth;
  }

  ngOnInit(): void {
    interval(30000).subscribe(this.switchTitle());
  }

  ngAfterViewInit(): void {
    this.sectionsObserved = [
      this.aboutContent,
      this.skillsContent,
      this.certsContent,
      this.servicesContent,
      this.contactContent
    ];

    // TODO: css provider / access service
    for (const cssid in document.styleSheets) {
      if (this.document.styleSheets[cssid] != null
        && this.document.styleSheets[cssid].type === 'text/css') {
        const element = document.styleSheets[cssid];
        // console.log(element);
      }
    }
    // this.headerFontColor = document.documentElement.style.getPropertyValue('--theme-accent');
  }

  private switchTitle(): (value: number) => void {
    return () => {
      if (this.titlePrefix === 'Raul') {
        this.titlePrefix = 'Software';
        this.titleSufix = 'Solutions';
      } else {
        this.titlePrefix = 'Raul';
        this.titleSufix = 'Schnelzer';
      }
    };
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    this.windowHeight = this.window.outerHeight;
    this.adjustHeaderOverlay();
    this.adjustCreativityIntro();
    this.adjustCreativityOutro();

    // console.log('aboutContent:', this.aboutContent.nativeElement.offsetTop);

    this.observeSections();
  }

  private observeSections() {
    for (const section in this.sectionsObserved) {
      if (this.sectionsObserved.hasOwnProperty(section)) {
        const element = this.sectionsObserved[section];
        if (this.evalSectionAppear(element, this.offset, this.windowHeight)) {
          const index = this.sectionsObserved.indexOf(element, 0);
          if (index > -1) {
            this.sectionsObserved.splice(index, 1);
          }
        }
      }
    }
  }

  private evalSectionAppear(section: ElementRef, offset: number, height: number): boolean {
    const position = section.nativeElement.offsetTop * 1.1;
    const classes = section.nativeElement.classList;
    if (position > offset && position <= (offset + height)) {
      classes.remove('hidden');
      classes.add('appear');
      return true;
    }
    return false;
  }

  private adjustCreativityIntro(): void {
    let fontsize = 28 * (1 - this.offset / this.windowHeight);
    if (fontsize < 2) {
      fontsize = 2;
    }
    let paddingPercantage = fontsize + 5;
    if (paddingPercantage > 30) {
      paddingPercantage = 30;
    }
    if (Math.abs(this.creativityIntroFontSize - fontsize) < 0.05) {
      return;
    }
    this.creativityIntroFontSize = fontsize;
    this.creativityIntro = `font-size: ${fontsize}vw;padding: ${paddingPercantage}vh 0 0 0;`;
  }

  private adjustCreativityOutro(): void {
    const scale = this.windowHeight > this.windowWidth ? 10 : 4;
    let fontsize = scale * (this.offset / this.windowHeight) - 2;
    if (fontsize < 0) {
      return;
    }
    if (fontsize > 9) {
      fontsize = 9;
    }
    const paddingPercantage = (10 - fontsize) * 2 + 10;
    if (Math.abs(this.creativityOutroFontSize - fontsize) < 0.05) {
      return;
    }
    this.creativityOutroFontSize = fontsize;
    this.creativityOutro = `font-size: ${fontsize}vw;padding: ${paddingPercantage}vh 0 0 0;`;
  }

  private adjustHeaderOverlay(): void {
    const minHeaderOverlayHeight = 80;
    const offsetCollapseBegin = 100.0;
    const offsetCollapseLimit = 200.0;

    if (this.offset > this.windowHeight) {
      this.overlayHeight = 0;
      return;
    }

    if (this.offset <= offsetCollapseBegin) {
      this.overlayHeight = minHeaderOverlayHeight;
      return;
    }

    let overlayPercentage = (offsetCollapseLimit - offsetCollapseBegin) / (this.offset - offsetCollapseBegin);

    if (overlayPercentage < 0.5) {
      overlayPercentage /= 1.1;
    }
    if (overlayPercentage < 0.3) {
      overlayPercentage /= 1.3;
    }

    let computedHeight = overlayPercentage * minHeaderOverlayHeight;

    if (computedHeight > minHeaderOverlayHeight) {
      computedHeight = minHeaderOverlayHeight;
    }

    if (Math.abs(this.overlayHeight - computedHeight) < 0.05) {
      return;
    }

    this.overlayHeight = computedHeight;
    return;
  }
}
