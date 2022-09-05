import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ui-achievement')
export class AchievementComponent extends LitElement {
    public title!: string;

    static styles = css`
        :host {
            --size: 50px;
        }

       .achievement-banner {
        position: absolute;
        left: 10px;
        bottom: 10px;
        width: var(--size);
        height: var(--size);
        font-size: 2em;
        background-color: transparent;
        overflow: hidden;
      }

      .achievement-banner .achievement-loader, .achievement-banner .achievement-trophy {
        width: var(--size);
        height: var(--size);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px;
        transform: scaleX(0) scaleY(0);
        transform-origin: 50% 50%;
        animation-fill-mode: forwards;
      }

      .achievement-banner .achievement-trophy {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: xboxLogoAnimationFrames ease-out 7.5s;
        animation-delay: 1s;
        color: #fff;
        background-color: transparent !important;
      }

      @keyframes xboxLogoAnimationFrames {
        0% {
          background-color: transparent !important;
          transform: scaleX(0) scaleY(0);
        }
        5% {
          background-color: transparent !important;
          transform: scaleX(1.2) scaleY(1.2);
        }
        10% {
          background-color: transparent !important;
          transform: scaleX(1) scaleY(1);
        }
        90% {
          background-color: transparent !important;
          transform: scaleX(1) scaleY(1);
        }
        95% {
          background-color: transparent !important;
          transform: scaleX(1.2) scaleY(1.2);
        }
        100% {
          background-color: transparent !important;
          transform: scaleX(0) scaleY(0);
        }
      }
    `;

    protected render() {
        return html`
        <div class="achievement-banner animated">
            <div class="achievement-loader"></div>
            <div class="achievement-loader"></div>
            <div class="achievement-loader"></div>
            <div class="achievement-loader"></div>
            <div class="achievement-loader"></div>
            <div class="achievement-trophy xbox-icon xbox-logo">
                🏆
            </div>
        </div>
        `;
    }
}