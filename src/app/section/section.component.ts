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

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.lazyLoading) {
      const offset = Math.min(600 - this.content.nativeElement.clientHeight, 0);
      const intersectionOptions = {
        // HACK: extending bounds for small sections which glitch out of intersection
        rootMargin: `${offset}px 0px ${offset}px 0px`,
        threshold: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      };
      const sectionObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const position = this.content.nativeElement.getBoundingClientRect().top;
            setTimeout(() => {
              const positionOffset = Math.abs(position - this.content.nativeElement.getBoundingClientRect().top);
              if (positionOffset < 250) {
                console.log(this.sectionId, 'loaded');
                this.loadContent(entry.target);
                sectionObserver.unobserve(entry.target);
              }
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
