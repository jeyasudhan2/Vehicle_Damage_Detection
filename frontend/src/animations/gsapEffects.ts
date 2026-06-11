import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ============================================================
// GSAP Animation Hooks
// Register ScrollTrigger once at module level; each hook
// creates its own timeline / tween and cleans up on unmount.
// ============================================================

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax effect — moves element at a fraction of scroll speed.
 * @param speed  Multiplier (e.g. 0.3 = 30 % of scroll speed)
 */
export function useParallax<T extends HTMLElement>(
    speed: number = 0.5
): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                y: () => speed * ScrollTrigger.maxScroll(window) * 0.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        });

        return () => ctx.revert();
    }, [speed]);

    return ref;
}

/**
 * Fade-up animation triggered when the element scrolls into view.
 */
export function useScrollFadeIn<T extends HTMLElement>(
    delay: number = 0
): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        return () => ctx.revert();
    }, [delay]);

    return ref;
}

/**
 * Stagger children into view on scroll (e.g. feature cards).
 */
export function useStaggerIn<T extends HTMLElement>(
    stagger: number = 0.15
): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const children = ref.current.children;
        if (!children.length) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                children,
                { opacity: 0, y: 80, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        return () => ctx.revert();
    }, [stagger]);

    return ref;
}

/**
 * Continuous floating animation — decorative background elements.
 */
export function useFloatingAnimation<T extends HTMLElement>(
    amplitude: number = 20,
    duration: number = 3
): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                y: `+=${amplitude}`,
                duration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });

        return () => ctx.revert();
    }, [amplitude, duration]);

    return ref;
}

/**
 * Hero entrance animation — used on the landing page hero section.
 */
export function useHeroEntrance<T extends HTMLElement>(): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const children = ref.current.children;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            tl.fromTo(
                children,
                { opacity: 0, y: 50, filter: 'blur(10px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    stagger: 0.2,
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return ref;
}

/**
 * Rotate-in animation for decorative elements.
 */
export function useRotateIn<T extends HTMLElement>(
    rotationDeg: number = 360,
    duration: number = 20
): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                rotation: rotationDeg,
                duration,
                repeat: -1,
                ease: 'linear',
            });
        });

        return () => ctx.revert();
    }, [rotationDeg, duration]);

    return ref;
}
