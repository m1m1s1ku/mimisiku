import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { Mimisiku } from '../core/mimisiku';

import Page from '../core/strategies/Page';
import { Pages } from '../mimisiku-app';
@customElement('ui-home')
export class HomeController extends Page {
  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page home" role="main">
        <section class="hero">
          <h1>Passionately building and creating, bringing the future to the present.</h1>
        </section>

        <section class="areas">
          <section class="service">
            <h2>Development</h2>
            <p>We utilise insights and expertise gained from managing multiple successful projects.</p>
            <ul>
              <li>Custom solutions using state of the art technologies</li>
              <li>Decentralization (DLT)</li>
              <li>Tracking solutions</li>
              <li>OpenID</li>
              <li>IoT</li>
            </ul>
            <a href="projects" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.projects)}>
              Projects
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </section>

          <section class="service">
            <h2>Networking</h2>
            <p>We have enabled the growth of large successful communities, deploying infrastructure at scale.</p>
            <ul>
              <li>On-premise private networks</li>
              <li>Self-sovereign identities</li>
              <li>Offshore hosting</li>
              <li>Monitoring</li>
              <li>Security</li>
            </ul>
            <a class="wip" href="wip" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.wip)}>
              Cases
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </section>
        </section>

        <div class="links">
          <a class="wip" href="wip" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.wip)}>
          // Lab.
          </a>
        </div>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-home': HomeController;
	}
}