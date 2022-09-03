import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import Page from '../core/strategies/Page';

@customElement('ui-wip')
export class WIPController extends Page {
  constructor() {
    super();
  }

  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page" role="main">
        <div class="content-section-header">
            <p>Work in progress...</p>
        </div>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-wip': WIPController;
	}
}