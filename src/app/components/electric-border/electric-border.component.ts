import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

let nextId = 0;

@Component({
  selector: 'app-electric-border',
  imports: [CommonModule],
  templateUrl: './electric-border.component.html',
  styleUrls: ['./electric-border.component.scss']
})
export class ElectricBorderComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() color: string = '#5227FF';
  @Input() speed: number = 1;
  @Input() chaos: number = 1;
  @Input() thickness: number = 2;
  @Input() extraClass: string = '';
  @Input() extraStyle: { [key: string]: any } = {};

  @ViewChild('root', { static: false }) rootRef!: ElementRef<HTMLDivElement>;
  @ViewChild('svgEl', { static: false }) svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('strokeEl', { static: false }) strokeRef!: ElementRef<HTMLDivElement>;

  filterId = `turbulent-displace-${++nextId}`;
  vars: { [key: string]: any } = {};

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateVars();
    this.setupResizeObserver();
    this.updateAnim();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color'] || changes['thickness']) {
      this.updateVars();
    }

    if ((changes['speed'] || changes['chaos']) && this.rootRef && this.svgRef) {
      // ensure view is ready
      Promise.resolve().then(() => this.updateAnim());
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private updateVars(): void {
    this.vars = {
      '--electric-border-color': this.color,
      '--eb-border-width': `${this.thickness}px`,
      ...this.extraStyle
    };
  }

  private setupResizeObserver(): void {
    if (!this.rootRef) return;
    this.resizeObserver = new ResizeObserver(() => this.updateAnim());
    this.resizeObserver.observe(this.rootRef.nativeElement);
  }

  private updateAnim(): void {
    const svg = this.svgRef?.nativeElement;
    const host = this.rootRef?.nativeElement;
    const stroke = this.strokeRef?.nativeElement;

    if (!svg || !host) return;

    if (stroke) {
      stroke.style.filter = `url(#${this.filterId})`;
    }

    const width = Math.max(
      1,
      Math.round(host.clientWidth || host.getBoundingClientRect().width || 0)
    );
    const height = Math.max(
      1,
      Math.round(host.clientHeight || host.getBoundingClientRect().height || 0)
    );

    const dyAnims = Array.from(
      svg.querySelectorAll('feOffset > animate[attributeName="dy"]')
    ) as SVGAnimationElement[];

    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute('values', `${height}; 0`);
      dyAnims[1].setAttribute('values', `0; -${height}`);
    }

    const dxAnims = Array.from(
      svg.querySelectorAll('feOffset > animate[attributeName="dx"]')
    ) as SVGAnimationElement[];

    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute('values', `${width}; 0`);
      dxAnims[1].setAttribute('values', `0; -${width}`);
    }

    const baseDur = 6;
    const dur = Math.max(0.001, baseDur / (this.speed || 1));
    [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

    const disp = svg.querySelector('feDisplacementMap') as SVGFEDisplacementMapElement | null;
    if (disp) {
      disp.setAttribute('scale', String(30 * (this.chaos || 1)));
    }

    const filterEl = svg.querySelector(`#${this.filterId}`) as SVGFilterElement | null;
    if (filterEl) {
      filterEl.setAttribute('x', '-200%');
      filterEl.setAttribute('y', '-200%');
      filterEl.setAttribute('width', '500%');
      filterEl.setAttribute('height', '500%');
    }

    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach(a => {
        const anyAnim = a as any;
        if (typeof anyAnim.beginElement === 'function') {
          try {
            anyAnim.beginElement();
          } catch {
            console.warn(
              'ElectricBorder: beginElement failed, this may be due to a browser limitation.'
            );
          }
        }
      });
    });
  }
}
