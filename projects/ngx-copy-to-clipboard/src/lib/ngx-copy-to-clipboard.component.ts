import { Component, OnInit, OnDestroy, Input, ElementRef, NgZone } from '@angular/core';
import ClipboardJS from 'clipboard';

const defaultHandler = e => e;

@Component({
  selector: 'ngx-copy-to-clipboard',
  template: `
    <button
      type="button"
      aria-label="ariaLabel"
      role="button"
      *ngIf="isSupported"
      [ngClass]="[className]"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
})
export class NgxCopyToClipboardComponent implements OnDestroy, OnInit {
  @Input()
  success: (e) => void = defaultHandler;

  @Input()
  error: (e) => void = defaultHandler;

  @Input()
  target: string = '';

  @Input()
  action: 'copy' | 'cut';

  isSupported = true;
  className = '';

  @Input()
  ariaLabel: string = 'Click to copy';

  private clipboard: { on: (eventName: string, cb: (e) => void) => void; destroy: any };

  constructor(private _el: ElementRef, private _zone: NgZone) {
    this.className = `ngx-copy-to-clipboard-${this.action}-${Date.now()}`;
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  ngOnInit() {
    this.isSupported = ClipboardJS.isSupported();

    if (this.isSupported) {
      const currentElement = this._el.nativeElement;

      const options = {
        ...(this.target ? { target: () => document.querySelector(this.target) } : {}),
      };
      this.clipboard = new ClipboardJS(currentElement, options);
      this.clipboard.on('success', this.handleSuccess);
      this.clipboard.on('error', this.handleError);
    }
  }

  private handleSuccess(e: any = {}) {
    e.clearSelection();
    this.success(e);
  }

  private handleError(e: any = {}) {
    e.clearSelection();
    this.error(e);
  }

  ngOnDestroy() {
    this.clipboard && this.clipboard.destroy();
  }
}