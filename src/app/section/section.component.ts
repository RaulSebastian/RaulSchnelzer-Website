import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit, AfterViewInit {

  @Input() sectionId: string;
  @Input() sectionTitle: string;
  @Input() link: string;
  @Input() lazyLoading: boolean;
  @Input() contentOverflow = 'hidden';

  @ViewChild('content', { static: false }) content: ElementRef;

  loaded = false;

  private lazyTimer = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.lazyLoading) {
      const intersectionOptions = {
        threshold: [...Array(10).keys()].map(i => i / 10)
      };
      const sectionObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (this.lazyTimer) {
              return;
            }
            const position = this.content.nativeElement.getBoundingClientRect().top;
            this.lazyTimer = true;
            setTimeout(() => {
              const positionOffset = Math.abs(position - this.content.nativeElement.getBoundingClientRect().top);
              if (positionOffset < 800) {
                console.log(this.sectionId, 'loaded');
                this.loadContent(entry.target);
                sectionObserver.unobserve(entry.target);
              }
            }, 500);
            setTimeout(() => {
              this.lazyTimer = false;
            }, 500);
          }
        }
      }, intersectionOptions
      );
      sectionObserver.observe(this.content.nativeElement);
    } else {
      this.loadContent(this.content.nativeElement);
    }
  }

  private loadContent(element: Element) {
    this.loaded = true;
    element.classList.remove('hidden');
    element.classList.add('appear');
  }
}
