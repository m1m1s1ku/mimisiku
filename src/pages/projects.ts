import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { repeat } from 'lit/directives/repeat.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { Mimisiku } from '../core/mimisiku';

import Page from '../core/strategies/Page';
import { Pages } from '../mimisiku-app';
import { GithubLogo, MaiaLogo } from '../svg';

@customElement('ui-projects')
export class ProjectsController extends Page {

  private projects = [
    {
        name: 'Google Authenticator Export',
        slug: 'ga-export',
        description: 'Export every secret easily from Google Authenticator (Authy in another repo too.).',
        repository: 'https://github.com/m1m1s1ku/gauth-export',
        status: 'published',
        url: 'https://ga.mimisiku.dev',
        tags: ['OTPAuth', 'Material'],
    },
    {
        logo: MaiaLogo,
        name: 'Maia',
        slug: 'maia',
        description: 'Financial recipes.',
        repository: 'https://github.com/m1m1s1ku/maia',
        status: 'wip',
        url: 'https://maia.kitchen',
        tags: ['Lit'],
    },
    {
        name: 'Fujin',
        slug: 'fujin',
        description: 'Crypto / news Bot on Telegram',
        repository: 'https://github.com/m1m1s1ku/fujin',
        status: 'wip',
        url: 'https://t.me/FujinCryptoBot',
        tags: ['NodeJS', 'Telegram', 'Bot', 'OPML', 'RSS'],
    },
    {
        name: 'BricksSDK',
        slug: 'bricks-sdk',
        description: 'An SDK to access Bricks.co',
        repository: 'https://github.com/m1m1s1ku/bricks_sdk',
        status: 'published',
        url: 'https://www.npmjs.com/package/@m1m1s1ku/monpetitplacement_sdk',
        tags: ['NodeJS', 'Typescript', 'Zod', 'Undici'],
    },
    {
        name: 'Persin Conseil',
        slug: 'persin',
        description: 'IT consulting and services',
        repository: 'https://github.com/Ghostfly/persin-conseil',
        url: 'https://www.persin.fr',
        tags: [ 'Lit', 'Offline ready', 'no-js handling' ],
    },

    {
        name: 'Cheno',
        slug: 'cheno',
        description: 'Iron artist',
        status: 'published',
        repository: 'https://github.com/ghostfly/cheno-website',
        url: 'https://www.cheno.fr',
        tags: [ 'Lit', 'GraphQL', 'Wordpress' ],
    },
    {
        name: 'Dobrunia Design',
        slug: 'dobrunia',
        description: 'Custom objects & interior design',
        status: 'published',
        repository: 'https://github.com/ghostfly/dobrunia-design',
        url: 'https://www.dobruniadesign.com',
        tags: [ 'Lit', 'GraphQL', 'Wordpress' ],
    },
    {
        name: 'Thiweb',
        slug: 'thiweb',
        description: 'Community.',
        repository: null,
        status: 'published',
        url: 'https://forum.thiweb.com',
        tags: ['PhpBB'],
    },
    {
        name: 'Talis Protocol',
        slug: 'talis-art',
        description: 'NFT Marketplace and much more.',
        status: 'published',
        repository: null,
        url: 'https://talis.art',
        tags: [ 'Next.JS', 'RxJS', 'Rust' ],
    },
  ];

  public render(): void | TemplateResult {
    return html`
      <div id="page" class="page" role="main">
        <div class="content-section-header">
            <h1>Projects</h1>
        </div>

        <section class="projects">
        ${repeat(this.projects, (project) => project.slug, (project) => html`
        <div class="project">
            <a href=${project.url}>${project.name}</a>
            <div class="excerpt">
                <p>${project.description}</p>
                <!-- <p class="tags">${map(project.tags, (tag) => html`<span class="tag">${tag}</span>`)}</p> -->
                ${when(project.repository, () => html`<a href="${project.repository}">${GithubLogo}</a>`)}
            </div>
        </div>
        `)}
        </section>

        <a class="back-home flex-link justify-end" href="home" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.home)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Home
        </a>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-projects': ProjectsController;
	}
}