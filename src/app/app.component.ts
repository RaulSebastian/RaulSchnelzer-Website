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
import { ThemeState, Themes } from './services/ThemeState';

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
    this.contentLazyLoading = 'IntersectionObserver' in this.window &&
      'IntersectionObserverEntry' in this.window;
  }

  title = 'Raul Schnelzer';
  titlePrefix = 'Raul';
  titleSufix = 'Schnelzer';
  titleicon = 'normal';
  privacyLastModified = new Date('2020-03-07');

  overlayHeight = 80;
  headerSeparatorHeight = 24;
  creativityIntro = {
    fontSize: 12,
    padding: 'padding:50vh 0 0 0',
    opacity: 1,
    display: 'inherit'
  };
  creativityOutro = {
    fontSize: 10,
    padding: 'padding:30vh 0 0 0',
    opacity: 1,
    backgroundAlpha: 1,
    display: 'inherit'
  };
  menuIcon = 'menu';
  themeIcon = {
    icon: 'wb_sunny',
    topMargin: 10,
    display: 'visible'
  };
  themeState = new ThemeState(Themes.Light);
  themeTransitionTimer: any;

  classes = {
    header: 'header',
    headerBacklight: false,
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

  @ViewChild('contentArea', { static: false }) contentArea: ElementRef;
  @ViewChild('landingPage', { static: false }) landingPage: ElementRef;
  @ViewChild('aboutAnchor', { static: false }) aboutAnchor: ElementRef;
  @ViewChild('skillsAnchor', { static: false }) skillsAnchor: ElementRef;
  @ViewChild('certsAnchor', { static: false }) certsAnchor: ElementRef;
  @ViewChild('servicesAnchor', { static: false }) servicesAnchor: ElementRef;
  @ViewChild('contactAnchor', { static: false }) contactAnchor: ElementRef;
  @ViewChild('intro', { static: false }) intro: ElementRef;
  @ViewChild('outro', { static: false }) outro: ElementRef;

  contentLazyLoading: boolean;
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
      this.observeContentArea();
      this.observeUpArrowVisibility();
      this.observerHeaderOverlay();
      this.observeCreativityIntro();
      this.observeCreativityOutro();
    } else {
      // TODO: fallback
    }
  }

  private observeContentArea() {
    const observerOptions = {
      threshold: this.percentualTthreshold
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0.1) {
          this.classes.header = 'header header-gradient';
          this.classes.headerBacklight = true;
          this.creativityOutro.backgroundAlpha = Math.min((0.2 - entry.intersectionRatio) * 5, 1);
        } else {
          this.classes.header = 'header';
          this.classes.headerBacklight = false;
          this.creativityOutro.backgroundAlpha = 1;
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.contentArea.nativeElement);
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
          // adjust menu items separator height
          this.headerSeparatorHeight = Math.max(Math.min((entry.intersectionRatio) * 24, 24), 6);
          this.themeIcon.topMargin = 10 + (25 * entry.intersectionRatio);
        } else {
          // hide header
          this.overlayHeight = 0;
          // min menu items separator height
          this.headerSeparatorHeight = 6;
          this.themeIcon.topMargin = 10;
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.landingPage.nativeElement);
  }

  private observeCreativityIntro() {
    const observerOptions = {
      threshold: this.promileTthreshold
    };
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) {

          const size = entry.boundingClientRect.y < 0 ? 12
            : entry.intersectionRatio * 12;
          const padding = (1 - entry.intersectionRatio)
            * (entry.boundingClientRect.y > 0 ? 80 : 150) + 20;
          const alpha = Math.max(entry.boundingClientRect.y > 0 ? 1
            : entry.intersectionRatio - 0.2, 0);
          const display = entry.intersectionRatio <= 0.1 ? 'none' : 'inherit';

          // adjust intro style
          this.creativityIntro.fontSize = size;
          this.creativityIntro.padding = `${padding}vh 0 0 0`;
          this.creativityIntro.opacity = alpha;
          this.creativityIntro.display = display;
        }
      }
    }, observerOptions);
    sectionObserver.observe(this.intro.nativeElement);
  }

  private observeCreativityOutro() {
    const observerOptions = {
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
          const display = entry.intersectionRatio <= 0.2 ? 'none' : 'inherit';

          // adjust intro style
          this.creativityOutro.fontSize = size;
          this.creativityOutro.padding = `${padding}vh 0 0 0`;
          this.creativityOutro.opacity = alpha;
          this.creativityOutro.display = display;
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

  public switchTheme(): void {
    if (this.themeState.IsInTransition) {
      return;
    }
    this.themeState.IsInTransition = true;
    this.themeIcon.icon = this.themeState.Theme === Themes.Light ? 'nights_stay' : 'wb_sunny';
    this.themeTransition();
  }

  private themeTransition(): void {

    const themeState = this.themeState;

    let foreground: string;
    let background: string;
    let backgroundAlpha: string;
    let backdrop: string;
    let accent: string;
    let inversion: string;
    let sectionBackgroud: string;
    let sectionHighlight: string;
    let sectionCorner: string;
    let glow: string;
    let shadow: string;
    let rotate: string;

    const darkBackdrop = '#202020f9';
    const lightBackdrop = '#ffffffef';

    function hex(decimal: number): string {
      let num = Math.round(decimal);
      num = num < 0 ? 0 : num > 255 ? 255 : num;
      return num.toString(16);
    }

    function transition() {
      const degree = themeState.Degree;
      if (degree <= 0) {
        background = 'white';
        backgroundAlpha = '#ffffff00';
        backdrop = lightBackdrop;
        foreground = '#454545';
        accent = '#8133e1';
        inversion = '0%';
        sectionBackgroud = '#cccccc';
        sectionHighlight = '#ffffff';
        sectionCorner = '#dedede';
        glow = '#b761ff';
        shadow = '#4444dd';
        rotate = '45deg';
      } else if (degree >= 1) {
        background = 'black';
        backgroundAlpha = '#00000000';
        backdrop = darkBackdrop;
        foreground = 'white';
        accent = '#00ffbf';
        inversion = '100%';
        sectionBackgroud = '#222222';
        sectionHighlight = '#535353';
        sectionCorner = '#373737';
        glow = '#76cce2';
        shadow = '#169295';
        rotate = '0deg';
      } else {
        foreground = degree >= 0.31 && degree < 0.33
          ? 'rgb(107,107,107)'
          : degree >= 0.33 && degree < 0.34
            ? 'rgb(117,117,117)'
            : degree >= 0.34 && degree < 0.36
              ? 'rgb(177,177,177)'
              : `rgb(${Math.round(degree * 255) + 69}, ${Math.round(degree * 255) + 69}, ${Math.round(degree * 255) + 69})`;
        accent = `hsl(267 - ${Math.round(degree * 102)}, ${74 + Math.round(degree * 26)}), 54%)`;
        inversion = `${Math.round(degree * 100)}%`;
        const inverse = 1 - degree;
        background = `rgb(${Math.round(inverse * 255)}, ${Math.round(inverse * 255)}, ${Math.round(inverse * 255)})`;
        backgroundAlpha = `#${hex(inverse * 255)}${hex(inverse * 255)}${hex(inverse * 255)}00`;
        sectionBackgroud = `#${hex(inverse * 170 + 34)}${hex(inverse * 170 + 34)}${hex(inverse * 170 + 34)}`;
        sectionHighlight = `#${hex(inverse * 172 + 83)}${hex(inverse * 172 + 83)}${hex(inverse * 172 + 83)}`;
        sectionCorner = `rgb(${Math.round(inverse * 167) + 55}, ${Math.round(inverse * 167) + 55}, ${Math.round(inverse * 167) + 55})`;
        rotate = `${Math.round(inverse * 45)}deg`;
        backdrop = inverse < 0.5 ? darkBackdrop : lightBackdrop;
      }

      const documentStyle = document.getElementsByTagName('html')[0].style;
      const themeBackground = documentStyle.getPropertyValue('--theme-background');
      const themeForeground = documentStyle.getPropertyValue('--theme-font-color');
      if (themeBackground !== background) {
        documentStyle.setProperty('--theme-background', background);
        documentStyle.setProperty('--theme-background-alpha', backgroundAlpha);
        documentStyle.setProperty('--theme-text-backdrop', backdrop);
      }
      if (themeForeground !== foreground) {
        documentStyle.setProperty('--theme-font-color', foreground);
        documentStyle.setProperty('--theme-accent', accent);
      }
      documentStyle.setProperty('--theme-color-inversion', inversion);
      documentStyle.setProperty('--theme-section-background', sectionBackgroud);
      documentStyle.setProperty('--theme-section-highlight', sectionHighlight);
      documentStyle.setProperty('--theme-section-corner', sectionCorner);

      if (glow) {
        documentStyle.setProperty('--theme-accent-glow', glow);
      }
      if (shadow) {
        documentStyle.setProperty('--theme-accent-shadow', shadow);
      }
      documentStyle.setProperty('--theme-color-rotate', rotate);

      if (!themeState.IsInTransition) {
        clearInterval(themeTransitionTimer);
        return;
      }
      themeState.Degree = themeState.Theme === Themes.Light ? degree + 0.02 : degree - 0.02;
    }

    const themeTransitionTimer = setInterval(transition, 50);
    setTimeout(() => {
      this.themeState = themeState;
    }, 52 * 50);
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
    const recurviseScroll = (retriesLeft: number) => {
      const offsetPosition = target.offsetTop + offset;
      if (Math.abs(this.window.pageYOffset - offsetPosition) > 100) {
        this.smoothScrollTo(offsetPosition);
      } else {
        return;
      }
      if (retriesLeft > 0) {
        setTimeout(() => { recurviseScroll(--retriesLeft); }, 250);
      }
    };
    recurviseScroll(3);
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
      this.menuIcon = 'menu_open';
    }
  }

  private showLegal(): void {
    this.isLegalOpen = true;
    this.classes.legal = 'legal fadein';
    this.themeIcon.display = 'none';
  }

  private showPrivacy(): void {
    this.isPrivacyOpen = true;
    this.classes.privacy = 'privacy fadein';
    this.themeIcon.display = 'none';
  }

  private hideNavMenu(): void {
    if (this.isNavOpen()) {
      this.classes.nav = this.classes.nav.replace('nav-in', 'nav-out');
      this.menuIcon = 'menu';
    }
  }

  private hideLegal(): void {
    this.classes.legal = 'legal collapsed';
    this.isLegalOpen = false;
    this.themeIcon.display = 'inherit';
  }

  private hidePrivacy(): void {
    this.classes.legal = 'privacy collapsed';
    this.isPrivacyOpen = false;
    this.themeIcon.display = 'inherit';
  }
}
