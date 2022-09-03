import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { Mimisiku } from '../core/mimisiku';

import Page from '../core/strategies/Page';
import { Pages } from '../mimisiku-app';

@customElement('ui-wip')
export class WIPController extends Page {
  constructor() {
    super();
  }

  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page wip" role="main">
        <div class="content-section-header">
            <p>Work in progress...</p>
        </div>

        <p>We are writing this content. Please come-back later!</p>

        <a class="flex-link justify-center" href="wip" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.home)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Home
        </a>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-wip': WIPController;
	}
}