import { MimisikuApp, Pages } from '../mimisiku-app';

export function Mimisiku(): MimisikuApp | null { return document.querySelector('mimisiku-app'); }

export async function load(route: string | null, content: HTMLElement | null): Promise<HTMLElement | null> {
    if(!content){
        throw new Error('Fatal, LitElement not ready.');
    }

    route = route ?? Pages.home;


    const defaultTitle = 'Mimisiku.';
    const componentName = 'ui-' + route;

    const Component = customElements.get(componentName) ?? customElements.get('ui-sign-up');

    content.classList.remove('full-width');

    const loaded = Component ? new Component() : null; 

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
