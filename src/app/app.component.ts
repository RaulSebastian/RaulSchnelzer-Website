import { Component, Inject, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { WINDOW } from './services/window.service';
import { interval } from 'rxjs';
import { AppRoute } from './app.routes';
import { ContactOptions } from './contact/contact.component';
import { SkillSets } from './services/skillsets';
import { Certificates } from './services/certificates';
import { OfferedServices } from './services/offeredServices';
import { NavigationEnd } from '@angular/router';

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
  creativityIntro = {
    fontSize: 12,
    padding: 'padding:50vh 0 0 0',
    opacity: 1
  };
  creativityOutro = {
    fontSize: 20,
    padding: 'padding:30vh 0 0 0',
    opacity: 1
  };
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

  @ViewChild('landingPage', { static: false }) landingPage: ElementRef;
  @ViewChild('aboutAnchor', { static: false }) aboutAnchor: ElementRef;
  @ViewChild('skillsAnchor', { static: false }) skillsAnchor: ElementRef;
  @ViewChild('certsAnchor', { static: false }) certsAnchor: ElementRef;
  @ViewChild('servicesAnchor', { static: false }) servicesAnchor: ElementRef;
  @ViewChild('contactAnchor', { static: false }) contactAnchor: ElementRef;
  @ViewChild('intro', { static: false }) intro: ElementRef;
  @ViewChild('outro', { static: false }) outro: ElementRef;

  isLegalOpen = false;
  isPrivacyOpen = false;

  private routeMappgingInitialized = false;
  private routeSubscription: any;
  private currentRoute = '';
  private navigating = false;

  private percentualTthreshold = [...Array(100).keys()].map(i => i / 100);
  private promileTthreshold = [...Array(1000).keys()].map(i => i / 1000);

  ngOnInit(): void {
    interval(20000).subscribe(this.switchTitle());
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {

        if (this.routeMappgingInitialized
          && !event.url.includes(this.currentRoute)) {
          return;
        }

        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        route.params.subscribe(param => {
          if (param.route === undefined) {
            return;
          }
          this.mapRouteToNavigation(param.route);
          this.routeMappgingInitialized = true;
        });
      }
    });
  }

  ngAfterViewInit(): void {

    if (
      'IntersectionObserver' in this.window &&
      'IntersectionObserverEntry' in this.window
    ) {
      this.observeUpArrowVisibility();
      this.observerHeaderOverlay();
      this.observeCreativityIntro();
      this.observeCreativityOutro();
    } else {
      // TODO: fallback
    }
  }

  private observerHeaderOverlay() {
    const observerOptions = {
      threshold: this.percentualTthreshold
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) {
          // resize header
          this.overlayHeight = Math.min((entry.intersectionRatio) * 80, 80);
        } else {
          // hide header
          this.overlayHeight = 0;
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.landingPage.nativeElement);
  }

  private observeCreativityIntro() {
    const observerOptions = {
      rootMargin: '0px 0px 0px 0px',
      threshold: this.promileTthreshold
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) {

          const size = entry.boundingClientRect.y < 0 ? 12
            : entry.intersectionRatio * 12;
          const padding = (1 - entry.intersectionRatio)
            * (entry.boundingClientRect.y > 0 ? 80 : 150) + 20;
          const alpha = entry.boundingClientRect.y > 0 ? 1
            : entry.intersectionRatio - 0.2;

          // adjust intro style
          this.creativityIntro.fontSize = size;
          this.creativityIntro.padding = `${padding}vh 0 0 0`;
          this.creativityIntro.opacity = alpha;
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.intro.nativeElement);
  }

  private observeCreativityOutro() {
    const observerOptions = {
      rootMargin: '0px 0px 0px 0px',
      threshold: this.promileTthreshold
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) {

          const size = entry.boundingClientRect.y < 0 ? 9
            : entry.intersectionRatio * 9;
          const padding = (1 - entry.intersectionRatio)
            * (entry.boundingClientRect.y > 0 ? 80 : 250) + 20;
          const alpha = entry.boundingClientRect.y > 0 ? 1
            : entry.intersectionRatio;

          // adjust intro style
          this.creativityOutro.fontSize = size;
          this.creativityOutro.padding = `${padding}vh 0 0 0`;
          this.creativityOutro.opacity = alpha;
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.outro.nativeElement);
  }

  private observeUpArrowVisibility() {
    const observerOptions = { threshold: [0.8, 0.9, 1] };
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
    const readableRoute = AppRoute[route];
    this.titleService.setTitle(readableRoute);
    this.currentRoute = readableRoute;

    console.log('navigation requested to', AppRoute[route]);
    this.hideNavMenu();
    if (route == null) {
      this.hideLegal();
      this.router.navigateByUrl('');
      return;
    }
    switch (route) {
      case AppRoute.home:
        this.hideLegal();
        this.hidePrivacy();
        this.scrollToTop();
        break;
      case AppRoute.about:
        this.hideLegal();
        this.hidePrivacy();
        this.checkedScroll(this.aboutAnchor.nativeElement);
        break;
      case AppRoute.skills:
        this.hideLegal();
        this.hidePrivacy();
        this.checkedScroll(this.skillsAnchor.nativeElement);
        break;
      case AppRoute.certifications:
        this.hideLegal();
        this.hidePrivacy();
        this.checkedScroll(this.certsAnchor.nativeElement);
        break;
      case AppRoute.services:
        this.hideLegal();
        this.hidePrivacy();
        this.checkedScroll(this.servicesAnchor.nativeElement);
        break;
      case AppRoute.contact:
        this.hideLegal();
        this.hidePrivacy();
        this.checkedScroll(this.contactAnchor.nativeElement);
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
    this.smoothScrollTo(0);
  }

  private checkedScroll(target: any, offset: number = 0) {
    if (this.navigating) {
      return;
    }
    const recurvise = (retriesLeft: number) => {
      const offsetPosition = target.offsetTop + offset;
      if (Math.abs(this.window.pageYOffset - offsetPosition) > 50) {
        this.smoothScrollTo(offsetPosition);
      } else {
        return;
      }
      if (retriesLeft > 0) {
        setTimeout(() => { recurvise(--retriesLeft); }, 250);
      }
    };
    recurvise(3);
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
    this.isPrivacyOpen = true;
    this.classes.privacy = 'privacy fadein';
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
    this.classes.legal = 'privacy collapsed';
    this.isPrivacyOpen = false;
  }
}
