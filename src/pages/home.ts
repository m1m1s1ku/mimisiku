import { html, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { customElement } from 'lit/decorators/custom-element.js';
import { Mimisiku } from '../core/mimisiku';

import Page from '../core/strategies/Page';
import { Pages } from '../mimisiku-app';
@customElement('ui-home')
export class HomeController extends Page {
  @query('#textA')
  private textA!: HTMLSpanElement;
  @query('#textB')
  private textB!: HTMLSpanElement;

  protected firstUpdated() {
    this.morphText();
  }

  private morphText() {
    const elts = {
      textA: this.textA,
      textB: this.textB
    };

    const texts = [
      'Authenticity',
      'Secrecy',
      'Integrity',
    ];

    const morphTime = 3;
    const cooldownTime = 0.5;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    elts.textA.textContent = texts[textIndex % texts.length];
    elts.textA.textContent = texts[(textIndex + 1) % texts.length];

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;
      
      let fraction = morph / morphTime;
      
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      
      setMorph(fraction);
    }

    function setMorph(fraction: number) {
      fraction = Math.cos(fraction * Math.PI) / -2 + .5;
      
      elts.textB.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.textB.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      
      fraction = 1 - fraction;
      elts.textA.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.textA.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      
      elts.textA.textContent = texts[textIndex % texts.length];
      elts.textB.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doCooldown() {
      morph = 0;
      
      elts.textB.style.filter = '';
      elts.textB.style.opacity = '100%';
      
      elts.textA.style.filter = '';
      elts.textA.style.opacity = '0%';
    }

    function animate() {
      requestAnimationFrame(animate);
      
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      // @ts-expect-error wtf
      const dt = (newTime - time) / 1000;
      time = newTime;
      
      cooldown -= dt;
      
      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }
        
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();
  }

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
              <li>On-Premise Private networks</li>
              <li>Offshore hosting</li>
              <li>Monitoring</li>
              <li>Security</li>
              <li>Support</li>
            </ul>
            <a class="wip" href="wip" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.wip)}>
              Cases
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </section>
        </section>

        <div class="links">
          <a href="https://status.mimisiku.network/status/mimisiku" target="_blank">
          // Network status.
          </a>
          <a class="wip" href="wip" @click=${(e: Event) => Mimisiku()?.navigateTo(e, Pages.wip)}>
          // Lab.
          </a>
          <span @click=${() => Mimisiku()?.randomColors()}>🎨</span>
        </div>

        <div id="hero-container">
          <span id="textA"></span>
          <span id="textB"></span>
        </div>

        <svg id="filters">
          <defs>
            <filter id="threshold">
              <feColorMatrix in="SourceGraphic"
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 255 -140" />
            </filter>
          </defs>
        </svg>
      </div>
    `;
  }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-home': HomeController;
	}
}