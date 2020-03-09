import { Component, HostListener, Inject, NgModule, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouteReuseStrategy } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from './services/window.service';
import { interval } from 'rxjs';
import { AppRoute } from './app.routes';
import { ContactOptions } from './contact/contact.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.windowHeight = this.window.outerHeight;
    this.windowWidth = this.window.outerWidth;

    const adress = this.window.location.href;
    const host = this.window.location.hostname;
    console.log('running ', adress, ' hosted on ', host);

    this.isProduction = adress.includes('raulschnelzer.de') && !adress.includes('preview');
  }

  title = 'Raul Schnelzer';
  titlePrefix = 'Raul';
  titleSufix = 'Schnelzer';
  titleicon = 'normal';
  overlayHeight = 80;
  overlayFontColor = 'white';
  headerFontColor = 'var(--theme-font-color)';
  overlayLogoSrc = 'assets/RS_logo_White400.png';
  headerLogoSrc = 'assets/RS_logo_Solar400.png';
  creativityIntro = 'font-size: 30vw;padding:30vh 0 0 0;';
  creativityOutro = 'font-size: 5vw;padding:30vh 0 0 0;';
  menuState = 'menu';
  classes = {
    legal: 'legal collapsed',
    logo: '',
    privacy: 'legal collapsed',
    nav: 'nav-menu nav-out',
    up: 'up collapsed'
  };

  isProduction = false;

  navigationAlias = [
    { synonym: 'me', reroute: AppRoute.about },
    { synonym: 'impressum', reroute: AppRoute.legal },
    { synonym: 'datenschutz', reroute: AppRoute.privacy }
  ];

  navigationItems = [
    { display: 'about', href: '/about' },
    { display: 'services', href: '/services' },
    { display: 'contact', href: '/contact' }
  ];

  navigationSubItems = [
    { display: 'privacy policy', href: '/privacy' },
    { display: 'legal notice', href: '/legal' },
  ];

  contactOptions = new Set([
    ContactOptions.name,
    ContactOptions.address,
    ContactOptions.directContact,
    ContactOptions.socialMedia
  ]);

  servicesOffered = [
    { description: 'Custom Software Development' },
    { description: 'Solutions Architecture' },
    { description: 'Enterprise Integration' },
    { description: 'Platform Consulting' },
    { description: 'Full Stack Development' },
    { description: 'Mobile App Development' },
    { description: 'Coding Reviews' }
  ];
  certificates = [
    {
      name: 'Azure Fundamentals',
      icon: '../assets/azureFundamentals.png',
      issuer: 'Microsoft',
      validFrom: 'Jan 2020',
      validUntil: 'No Expiration',
      link: 'https://www.youracclaim.com/badges/1d7f7742-a5d5-468c-b6b8-4eecdb2726a2/linked_in_profile'
    },
    {
      name: 'Professional Scrum Developer',
      icon: '../assets/ScrumBadgePSD1.svg',
      issuer: 'Scrum.org', validFrom: 'Jul 2019', validUntil: 'No Expiration',
      link: 'https://www.scrum.org/certificates/428766'
    },
    {
      name: 'Google Analytics Individual',
      icon: '../assets/googleAnalyticsLogo.svg',
      issuer: 'Google',
      validFrom: 'Jun 2019',
      validUntil: 'Jun 2020',
      link: 'https://skillshop.exceedlms.com/student/award/34095694'
    },
    {
      name: 'SOA Done Right 2018',
      icon: '../assets/particularLogo.png',
      issuer: 'Particular Software',
      validFrom: 'Dec 2018',
      validUntil: 'No Expiration',
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
        'Microservices', 'N-Tier', 'MV*', 'Onion', 'Cloud first', 'RESTful',
        'Distributed Systems'
      ]
    },
    {
      category: 'Paradigms', skills: [
        'OOP', 'Functional', 'Event-Driven'
      ]
    },
    {
      category: 'Programming Languages', skills: [
        'C#', 'T-SQL', 'TypeScript', 'Python', 'Dart'
      ]
    },
    {
      category: 'Frameworks', skills: [
        '.Net Core', 'Angular', 'Blazor', 'Aurelia', 'ASP.Net Core', 'NServiceBus', 'Node.js',
        'GraphQL', 'UWP', 'C4', 'Flutter', 'WPF', 'Akka.Net'
      ]
    },
    {
      category: 'Tools', skills: [
        'Visual Studio', 'VS Code', 'Jetbrains Toolbox', 'Git', 'TFS VC', 'MS BI Data Tools',
        'Powershell', 'Adobe Photoshop', 'Affinity Designer', 'Affinity Photo'
      ]
    },
    {
      category: 'DBMS', skills: [
        'SQL Server', 'RavenDB', 'MongoDB', 'CosmosDB', 'MySql', 'Oracle', 'EventStore'
      ]
    },
    {
      category: 'Platforms', skills: [
        'Azure', 'Kubernetes', 'Docker', 'Azure DevOps (Server)', 'SharePoint'
      ]
    }
  ];

  @ViewChild('aboutContent', { static: false }) aboutContent: ElementRef;
  @ViewChild('aboutHeader', { static: false }) aboutHeader: ElementRef;
  @ViewChild('servicesContent', { static: false }) servicesContent: ElementRef;
  @ViewChild('certsContent', { static: false }) certsContent: ElementRef;
  @ViewChild('skillsContent', { static: false }) skillsContent: ElementRef;
  @ViewChild('contactContent', { static: false }) contactContent: ElementRef;
  @ViewChild('legalContent', { static: false }) legalContent: ElementRef;

  private offset = 0;
  private windowHeight: number;
  private windowWidth: number;
  private sectionsObserved: Array<ElementRef>;
  private creativityIntroFontSize = 0;
  private creativityOutroFontSize = 0;
  private routeSubscription: any;
  private navigating = false;

  ngOnInit(): void {
    interval(20000).subscribe(this.switchTitle());

    this.routeSubscription =
      this.router.events.subscribe(() => {
        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        route.params.subscribe(param => {
          if (param.route !== undefined) {
            this.mapRouteToNavigation(param.route);
          }
        });
      });
  }

  ngAfterViewInit(): void {
    this.sectionsObserved = [
      this.aboutContent,
      this.skillsContent,
      this.certsContent,
      this.servicesContent,
      this.contactContent
    ];
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private mapRouteToNavigation(route: string): void {
    let directive = AppRoute[route];
    for (const alias of this.navigationAlias) {
      if (route === alias.synonym) {
        directive = alias.reroute;
        break;
      }
    }
    if (directive !== undefined) {
      this.navigate(directive);
    }
  }

  private navigate(route: AppRoute) {
    if (this.navigating) {
      return;
    }
    this.navigating = true;
    console.log('navigation requested to', AppRoute[route]);
    this.hideNavMenu();
    if (route == null) {
      this.hideLegal();
      this.router.navigateByUrl('');
      return;
    }
    let offsetPosition = 0;
    switch (route) {
      case AppRoute.home:
        this.hideLegal();
        this.hidePrivacy();
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.about:
        this.hideLegal();
        this.hidePrivacy();
        offsetPosition = this.aboutHeader.nativeElement.offsetTop;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.skills:
        this.hideLegal();
        this.hidePrivacy();
        offsetPosition = this.skillsContent.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.certifications:
        this.hideLegal();
        this.hidePrivacy();
        offsetPosition = this.certsContent.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.services:
        this.hideLegal();
        this.hidePrivacy();
        offsetPosition = this.servicesContent.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.contact:
        this.hideLegal();
        this.hidePrivacy();
        offsetPosition = this.contactContent.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.legal:
        this.hidePrivacy();
        this.showLegal();
        break;
      case AppRoute.privacy:
        this.hideLegal();
        this.showPrivacy();
        break;
      default:
        this.hideLegal();
        break;
    }
    this.navigating = false;
  }

  private switchTitle(): (value: number) => void {
    return () => {
      if (this.titlePrefix === 'Raul') {
        this.titlePrefix = 'Software';
        this.titleSufix = 'Solutions';
        this.classes.logo = 'flipped';
      } else {
        this.titlePrefix = 'Raul';
        this.titleSufix = 'Schnelzer';
        if (this.classes.logo === 'flipped') {
          this.classes.logo = 'normal';
        }
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
    this.checkSrollUpVisibility();
    this.observeSections();
    this.themeTransition();
  }

  private checkSrollUpVisibility(): void {
    const determinedClass =
      this.offset > this.windowHeight * 2
        ? 'up'
        : 'up collapsed';

    if (this.classes.up !== determinedClass) {
      this.classes.up = determinedClass;
    }
  }

  private themeTransition(): void {

    let foreground: string;
    let background: string;
    let backgroundAlpha: string;
    let backdrop: string;
    let accent: string;
    let inversion: string;
    let menuBackground: string;

    const darkAlpha = '#00000000';
    const lightAlpha = '#ffffff00';
    const darkBackdrop = '#202020f0';
    const lighBackdrop = '#ffffffef';
    const darkMenuBackground = '#571e9b';
    const lightMenuBackground = '#00ffbf';

    const transitionStart = this.servicesContent.nativeElement.offsetTop - 50;
    const transitionEnd = this.contactContent.nativeElement.offsetTop - 160;
    if (this.offset < transitionStart) {
      background = 'white';
      backgroundAlpha = lightAlpha;
      backdrop = lighBackdrop;
      menuBackground = lightMenuBackground;
      foreground = '#454545';
      accent = '#8133e1';
      inversion = '0%';
    } else if (this.offset > transitionEnd) {
      background = 'black';
      backgroundAlpha = darkAlpha;
      backdrop = darkBackdrop;
      menuBackground = darkMenuBackground;
      foreground = 'white';
      accent = '#00ffbf';
      inversion = '100%';
    } else {
      let degree = (this.offset - transitionStart) / (transitionEnd - transitionStart);
      if (degree < 0 || degree > 1) {
        return;
      }
      foreground = degree >= 0.31 && degree < 0.33
        ? 'rgb(107,107,107)'
        : degree >= 0.33 && degree < 0.34
          ? 'rgb(117,117,117)'
          : degree >= 0.34 && degree < 0.36
            ? 'rgb(177,177,177)'
            : `rgb(${Math.round(degree * 255) + 69}, ${Math.round(degree * 255) + 69}, ${Math.round(degree * 255) + 69})`;
      accent = `hsl(267 - ${Math.round(degree * 102)}, ${74 + Math.round(degree * 26)}), 54%)`;
      inversion = `${Math.round(degree * 100)}%`;
      degree = 1 - degree;
      background = `rgb(${Math.round(degree * 255)}, ${Math.round(degree * 255)}, ${Math.round(degree * 255)})`;
      if (degree < 0.5) {
        backdrop = darkBackdrop;
        menuBackground = darkMenuBackground;
        backgroundAlpha = darkAlpha;
      } else {
        backdrop = lighBackdrop;
        menuBackground = lightMenuBackground;
        backgroundAlpha = lightAlpha;
      }
    }

    const theme = document.getElementsByTagName('html')[0].style;
    const themeBackground = theme.getPropertyValue('--theme-background');
    const themeForeground = theme.getPropertyValue('--theme-font-color');
    if (themeBackground !== background) {
      theme.setProperty('--theme-background', background);
      theme.setProperty('--theme-background-alpha', backgroundAlpha);
      theme.setProperty('--theme-text-backdrop', backdrop);
    }
    if (themeForeground !== foreground) {
      theme.setProperty('--theme-font-color', foreground);
      theme.setProperty('--theme-accent', accent);
    }
    theme.setProperty('--theme-menu-background-from', menuBackground);
    theme.setProperty('--theme-menu-background-to', accent);
    theme.setProperty('--theme-color-inversion', inversion);
  }

  private observeSections(): void {
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

  public navButtonPressed(): void {
    if (this.isNavOpen()) {
      this.hideNavMenu();
    } else {
      this.showNavMenu();
    }
  }

  public closeLegal(): void {
    this.hideLegal();
  }

  public closePrivacy(): void {
    this.hidePrivacy();
  }

  public scrollToTop(): void {
    this.smoothScrollTo(0);
  }

  private smoothScrollTo(offsetPosition: number): void {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  private evalSectionAppear(section: ElementRef, offset: number, height: number): boolean {
    const position = section.nativeElement.offsetTop;
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

  private isNavOpen(): boolean {
    return this.classes.nav.includes('nav-in');
  }

  private isLegalVisible(): boolean {
    return !this.classes.legal.includes('collapsed');
  }

  private isPrivacyVisible(): boolean {
    return !this.classes.privacy.includes('collapsed');
  }

  private showNavMenu(): void {
    if (!this.isNavOpen()) {
      this.classes.nav = this.classes.nav.replace('nav-out', 'nav-in');
      this.menuState = 'menu_open';
    }
  }

  private showLegal(): void {
    if (!this.isLegalVisible()) {
      this.classes.legal = this.classes.legal.replace('collapsed', 'fadein');
    }
  }

  private showPrivacy(): void {
    if (!this.isPrivacyVisible()) {
      this.classes.privacy = this.classes.privacy.replace('collapsed', 'fadein');
    }
  }

  private hideNavMenu(): void {
    if (this.isNavOpen()) {
      this.classes.nav = this.classes.nav.replace('nav-in', 'nav-out');
      this.menuState = 'menu';
    }
  }

  private hideLegal(): void {
    if (this.isLegalVisible()) {
      this.classes.legal = this.classes.legal.replace('fadein', 'collapsed');
    }
  }

  private hidePrivacy(): void {
    if (this.isPrivacyVisible()) {
      this.classes.privacy = this.classes.privacy.replace('fadein', 'collapsed');
    }
  }
}
