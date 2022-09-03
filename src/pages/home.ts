import { html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import Page from '../core/strategies/Page';
import { create } from './home-part';

@customElement('ui-home')
export class HomeController extends Page {
  protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    create();
  }

  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page" role="main">
        <canvas class="background-canvas"></canvas>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-home': HomeController;
	}
}