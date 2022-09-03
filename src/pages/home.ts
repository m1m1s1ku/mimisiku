import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import Page from '../core/strategies/Page';
@customElement('ui-home')
export class HomeController extends Page {
  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page" role="main">

        <section class="service">
          <h2>Development</h2>
          <ul>
            <li>Custom development using state of the art technologies</li>
            <li>Decentralized technologies</li>
            <li>Open Source</li>
            <li>IoT</li>
          </ul>
          <a href="wip">
            Projects
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </span>
          </a>
        </section>

        <section class="service">
          <h2>Networking</h2>
          <ul>
            <li>Private networks</li>
            <li>Offshore hosting</li>
            <li>Monitoring</li>
          </ul>
          <a href="wip">
            Cases
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </span>
          </a>
        </section>

        <footer>
          &copy; Mimisiku. | ${new Date().getFullYear()} | <a href="https://github.com/m1m1s1ku">GitHub</a>
        </footer>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-home': HomeController;
	}
}