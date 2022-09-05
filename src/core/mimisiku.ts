import { MimisikuApp, Pages } from '../mimisiku-app';
import { NotFoundController } from '../pages/not-found';

export function Mimisiku(): MimisikuApp | null { return document.querySelector('mimisiku-app'); }

export async function load(route: string | null, content: HTMLElement | null): Promise<HTMLElement | null> {
    if(!content){
        throw new Error('Fatal, LitElement not ready.');
    }

    route = route ?? Pages.home;

    const defaultTitle = 'Mimisiku.';
    const componentName = 'ui-' + route;

    const hasComponent = customElements.get(componentName);
    const Component = hasComponent ?? customElements.get('ui-not-found');

    let loaded: HTMLElement | null = null;
    if(Component) {
        console.warn(Component.name);
        loaded = new Component(Component.name === 'NotFoundController' ? route === Pages.wip ? 'Work in progress' : 'Not found' : undefined);
    }

    document.title = defaultTitle;

    window.scrollTo(0,0);

    const removeChilds = (parent: HTMLElement) => {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    };

    if(!loaded){ return null; }

    removeChilds(content);
    content.appendChild(loaded);

    return loaded;
}
