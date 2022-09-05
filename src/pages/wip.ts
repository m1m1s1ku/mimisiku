import { customElement } from 'lit/decorators.js';
import { NotFoundController } from './not-found';

@customElement('ui-wip')
export class WipController extends NotFoundController {
    constructor(title = 'Work in progress') {
        super();
        this.pageTitle = title;
    }
}

declare global {
	interface HTMLElementTagNameMap {
		'ui-wip': WipController;
	}
}