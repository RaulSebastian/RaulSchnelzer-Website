import { Component, Inject, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { WINDOW } from './services/window.service';
import { interval } from 'rxjs';
import { AppRoute } from './app.routes';
import { ContactOptions } from './contact/contact.component';
import { SkillSets } from './services/skillsets';
import { Certificates } from './services/certificates';
import { OfferedServices } from './services/offeredServices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private titleService: Title,
    @Inject(WINDOW) public window: Window,
    private router: Router,
    private route: ActivatedRoute
  ) {

    const adress = this.window.location.href;
    const host = this.window.location.hostname;
    console.log('running ', adress, ' hosted on ', host);

    this.isProduction = adress.includes('raulschnelzer.de') && !adress.includes('preview');

  }

  title = 'Raul Schnelzer';
  titlePrefix = 'Raul';
  titleSufix = 'Schnelzer';
  titleicon = 'normal';
  privacyLastModified = new Date('2020-03-07');

  overlayHeight = 80;
  overlayFontColor = 'white';
  headerFontColor = 'var(--theme-font-color)';
  overlayLogoSrc = 'assets/RS_logo_White400.png';
  headerLogoSrc = 'assets/RS_logo_Solar400.png';
  creativityIntro = 'font-size: 30vw;padding:30vh 0 0 0;';
  creativityOutro = 'font-size: 5vw;padding:30vh 0 0 0;';
  menuState = 'menu';
  classes = {
    legal: 'legal fade',
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

  servicesOffered = OfferedServices.offered;
  certificates = Certificates.Acquired;
  skillsets = SkillSets.Categories;

  @ViewChild('aboutAnchor', { static: false }) aboutAnchor: ElementRef;
  @ViewChild('skillsAnchor', { static: false }) skillsAnchor: ElementRef;
  @ViewChild('certsAnchor', { static: false }) certsAnchor: ElementRef;
  @ViewChild('servicesAnchor', { static: false }) servicesAnchor: ElementRef;
  @ViewChild('contactAnchor', { static: false }) contactAnchor: ElementRef;
  @ViewChild('intro', { static: false }) intro: ElementRef;
  @ViewChild('outro', { static: false }) outro: ElementRef;

  isLegalOpen = false;
  isPrivacyOpen = false;

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
            // TODO
            this.mapRouteToNavigation(param.route);
          }
        });
      });
  }

  ngAfterViewInit(): void {

    if (
      'IntersectionObserver' in this.window &&
      'IntersectionObserverEntry' in this.window
    ) {
      this.observeUpArrowVisibility();
      this.observeCreativityIntro();
    } else {
      // TODO: fallback
    }
  }

  private observeCreativityIntro() {
    const observerOptions = {
      rootMargin: '-50px',
      threshold: [...Array(100).keys()].map(i => i / 100)
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {

          // resize header
          if (entry.boundingClientRect.y > 0) {
            this.overlayHeight = Math.min(Math.max((0.8 - entry.intersectionRatio) * 115, 0), 80);
          }

          let size = entry.boundingClientRect.y < 0 ? 12
            : (1.2 - entry.intersectionRatio) * 30;
          if (size < 12) {
            size = 12;
          }
          const alpha = entry.boundingClientRect.y > 0 ? 1
            : Math.floor((entry.intersectionRatio - 0.68) * 330) / 100;
          // adjust intro style
          this.creativityIntro = `font-size: ${size}vw;padding:${size}vh 0 0 0;opacity:${alpha};`;
        } else {
          if (entry.boundingClientRect.y < 0) {
            // hide header overlay
            this.overlayHeight = 0;
          }
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.intro.nativeElement);
  }

  private observeCreativityOutro() {
    const observerOptions = {
      rootMargin: '-50px',
      threshold: [...Array(100).keys()].map(i => i / 100)
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
      }
    });
    sectionObserver.observe(this.intro.nativeElement);
  }

  private observeUpArrowVisibility() {
    const observerOptions = { threshold: [1] };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.boundingClientRect.y < 1) {
          this.classes.up = 'up flyup';
        } else {
          this.classes.up = 'up flydown';
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.aboutAnchor.nativeElement);
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
    this.titleService.setTitle(AppRoute[route]);
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
        offsetPosition = this.aboutAnchor.nativeElement.offsetTop;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.skills:
        this.hideLegal();
        this.hidePrivacy();
        offsetPosition = this.skillsAnchor.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.certifications:
        this.hideLegal();
        this.hidePrivacy();
        // offsetPosition = this.certsContent.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.services:
        this.hideLegal();
        this.hidePrivacy();
        // offsetPosition = this.servicesContent.nativeElement.offsetTop - 200;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.contact:
        this.hideLegal();
        this.hidePrivacy();
        // offsetPosition = this.contactContent.nativeElement.offsetTop - 200;
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
    this.router.navigateByUrl('');
    setTimeout(() => {
      this.smoothScrollTo(0);
    }, 333);
  }

  private smoothScrollTo(offsetPosition: number): void {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  private isNavOpen(): boolean {
    return this.classes.nav.includes('nav-in');
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
    this.isLegalOpen = true;
    this.classes.legal = 'legal fadein';
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
    this.classes.legal = 'legal collapsed';
    this.isLegalOpen = false;
  }

  private hidePrivacy(): void {
    if (this.isPrivacyVisible()) {
      this.classes.privacy = this.classes.privacy.replace('fadein', 'collapsed');
    }
  }
}
