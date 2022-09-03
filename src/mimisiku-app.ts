import './index.scss';

import { html, TemplateResult, render } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import Root from './core/strategies/Root';

export enum Pages {
	root = '',
	home = 'home',
	notFound = 'not-found'
}

@customElement('mimisiku-app')
export class MimisikuApp extends Root {
	public static readonly is: string = 'mimisiku-app';

	public routing: Promise<void>;

	public get loadables(): string[] {
		return [];
	}

	public get needed(): string[] {
		return [
			'ui-not-found',
			'ui-home',
		];
	}

	constructor(path: string) {
		super();

		// @todo : fix darkmode toggle
		this.routing = import('./pages').then(() => {
			return this.firstLoad(path);
		}).then(() => {
			// At this point of time, we should be able to do anything with the App.
		});
	}

	private async firstLoad(path: string): Promise<HTMLElement | null> {
		if(path === undefined || path === null) {
			path = Pages.root;
		}

		path = path.startsWith('/') ? path.slice(1) : path;

		switch(path) {
			case Pages.root:
			case Pages.home: {
				return await this.load(Pages.home);
			}
			default:
				return await this.load(Pages.notFound);
		}
	}

	private redirect(page: Pages, link?: HTMLElement): void {
		const links = this.querySelectorAll('.app-sidebar a');
		links.forEach(link => link.classList.remove('active'));

		this.load(page);

		if(link) {
			link.classList.add('active');
		}
	}

	public render(): TemplateResult {
		return html`
		<div class="mimisiku">
			<div class="app-container">
				${this.appHeader}
				<div class="app-content">
					<div class="content-section" id="content"></div>
				</div>
			</div>
		</div>`;
	}

	private preventAndNavigate(e: Event, page: Pages): void {
		e.preventDefault();
		this.redirect(page);
	}

	private get appHeader(): TemplateResult {
		return html`
		<div class="app-header">
			<div class="app-header-left">
				<p class="app-name text-gradient"><a href="home" @click=${(e: Event) => this.preventAndNavigate(e, Pages.home)}>// Mimisiku.</a></p>
			</div>
		</div>`;
	}

	public showLoader(): void {
		render(html`<div id="loader" class="loader"><div class="handler-content"><div id="spinner" class="spinner large">//Mimisiku.</div></div></div>`, document.body, { host: this });
	}

	public async showTime(): Promise<void> {
		const duration = 1200;
		const loader = document.body.querySelector('#loader');
		if(!loader) { return; }
		
		const fadeOut = loader.animate({ opacity: [1, 0] }, duration);

		await new Promise(resolve => {
			if (document.body.querySelector('mimisiku-app')) { return; }
			document.body.appendChild(this);

			setTimeout(() => {
				if (!loader.parentElement) { return; }

				loader.parentElement.removeChild(loader);
				resolve(undefined);
			}, duration / 2);
		});

		await fadeOut.finished;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mimisiku-app': MimisikuApp;
	}
}