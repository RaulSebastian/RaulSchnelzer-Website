import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WINDOW_PROVIDERS } from './services/window.service';
import { HeaderComponent } from './header/header.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LegalComponent } from './legal/legal.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { FluidGradientDivComponent } from './services/fluid-gradient-div/fluid-gradient-div.component';
import { SectionComponent } from './section/section.component';
import { SafePipe } from './services/pipes/safePipe';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    LegalComponent,
    PrivacyComponent,
    FluidGradientDivComponent,
    SectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSlideToggleModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
  providers: [WINDOW_PROVIDERS]
})
export class AppModule { }

registerLocaleData(localeDe, 'de-DE');
