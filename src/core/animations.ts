interface Animation {
    effect: PropertyIndexedKeyframes;
    options: KeyframeAnimationOptions;
}

export function pulseWith(duration: number): Animation {
    return {
        effect: {
            opacity: [.5, 1],
            transform: ['scale(.95)', 'scale(1)'],
        },
        options: {
            duration
        }
    };
}

export function fadeWith(duration: number, enter: boolean): Animation {
    return {
        effect: {
            opacity: enter ? [0, 1] : [1, 0]
        },
        options: {
            duration
        }
    };
}

export default {
    pulseWith,
    fadeWith
};