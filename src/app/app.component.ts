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

  servicesOffered = OfferedServices.offered;
  certificates = Certificates.Acquired;
  skillsets = SkillSets.Categories;

  @ViewChild('aboutAnchor', { static: false }) aboutAnchor: ElementRef;

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
    } else {
      // TODO: fallback
    }
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
        // offsetPosition = this.aboutHeader.nativeElement.offsetTop;
        this.smoothScrollTo(offsetPosition);
        break;
      case AppRoute.skills:
        this.hideLegal();
        this.hidePrivacy();
        // offsetPosition = this.skillsContent.nativeElement.offsetTop - 200;
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
