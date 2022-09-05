import './index.scss';

import { html, TemplateResult, render } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import Root from './core/strategies/Root';
import { create } from './pages/home-part';
import { GithubLogo } from './svg';
import { query } from 'lit/decorators.js';

import { bufferCount, first, firstValueFrom, from, fromEvent, map, of, skipWhile, switchMap, tap } from 'rxjs';

export enum Pages {
	root = '',
	home = 'home',
	wip = 'wip',
	projects = 'projects',
	notFound = 'not-found'
}
@customElement('mimisiku-app')
export class MimisikuApp extends Root {
	public static readonly is: string = 'mimisiku-app';

	@query('#audio')
	private audio!: HTMLAudioElement;

	public routing: Promise<void>;

	public randomColors!: () => void;

	public get loadables(): string[] {
		return [];
	}

	public get needed(): string[] {
		return [
			'ui-not-found',
			'ui-home',
			'ui-projects',
			'ui-wip',
		];
	}

	constructor(path: string) {
		super();

		const table: {[key: string]: number} = {
			ArrowUp: 38,
			ArrowDown: 40,
			ArrowLeft: 37,
			ArrowRight: 39,
			KeyB: 66,
			KeyQ: 65,
			KeyA: 65,
		};

		const konami$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
			tap(console.log),
			map((e) => table[e.code] ? table[e.code] : null),
			tap(console.log),
			skipWhile((k) => k !== 38),
			bufferCount(10),
			first((ks) => {
				return ks.length === 10 && 
						ks[0] === 38 && ks[1] == 38 &&
						ks[2] == 40 && ks[3] == 40 &&
						ks[4] == 37 && ks[5] == 39 &&
						ks[6] == 37 && ks[7] == 39 &&
						ks[8] == 66 && ks[9] == 65;
			})
		);

		this.routing = firstValueFrom(from(import('./pages')).pipe(
			switchMap(() => {
				return this.firstLoad(path);
			}),
			switchMap(() => {
				const toolbox = create();
				if(!toolbox) { return of(undefined); }
	
				this.randomColors = () => {
					toolbox.palette.setColors();
					toolbox.palette.setCustomProperties();
				
					toolbox.orbs.forEach((orb) => {
						orb.fill = parseInt(toolbox.palette.randomColor(), 16);
					});
				};
	
				return firstValueFrom(konami$.pipe(
					switchMap(async () => {
						const assets = [
							// @ts-expect-error meh
							import('./assets/egg/mimisiku.opus'),
							// @ts-expect-error meh
							import('./assets/egg/mimisiku.ogg'),
							// @ts-expect-error meh
							import('./assets/egg/mimisiku.mp3'),
						];
	
						const [opus, ogg, mp3] = await Promise.all(assets);
	
						const opusSource = this.audio.querySelector<HTMLSourceElement>('source#opus');
						const oggSource = this.audio.querySelector<HTMLSourceElement>('source#ogg');
						const mp3Source = this.audio.querySelector<HTMLSourceElement>('source#mp3');
	
						if (opusSource) {
							opusSource.src = opus.default;
						}
						if (oggSource) {
							oggSource.src = ogg.default;
						}
						if (mp3Source) {
							mp3Source.src = mp3.default;
						}
	
						this.audio.load();
						return await this.audio.play();
					})
				));
			})
		));
	}

	private async firstLoad(path: string): Promise<HTMLElement | null> {
		if(path === undefined || path === null) {
			path = Pages.root;
		}

		path = path.startsWith('/') ? path.slice(1) : path;

		switch(path) {
			case Pages.root:
			case Pages.home:
				return await this.load(Pages.home);
			case Pages.wip:
				return await this.load(Pages.wip);
			case Pages.projects:
				return await this.load(Pages.projects);
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
					<canvas class="background-canvas"></canvas>
				</div>
				<footer class="footer mimi-${this.route}">
					&copy; Mimisiku. | ${new Date().getFullYear()} <a target="_blank" href="https://github.com/m1m1s1ku">${GithubLogo}</a>
				</footer>
				<audio id="audio">
					<source id="opus" src type="audio/ogg; codecs=opus"/>
					<source id="ogg" src type="audio/ogg; codecs=vorbis"/>
					<source id="mp3" src type="audio/mpeg"/>
				</audio>
			</div>
		</div>`;
	}

	public navigateTo(e: Event, page: Pages): void {
		e.preventDefault();
		this.redirect(page);
	}

	private get appHeader(): TemplateResult {
		return html`
		<div class="app-header">
			<div class="app-header-left">
				<p class="app-name text-gradient"><a href="home" @click=${(e: Event) => this.navigateTo(e, Pages.home)}>// Mimisiku.</a></p>
			</div>
		</div>`;
	}

	public showLoader(): void {
		render(html`<div id="loader" class="loader"><div class="handler-content"><div id="spinner" class="spinner large"></div></div></div>`, document.body, { host: this });
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
			}, duration);
		});

		await fadeOut.finished;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mimisiku-app': MimisikuApp;
	}
}