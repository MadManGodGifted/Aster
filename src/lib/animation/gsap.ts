import { gsap } from "gsap";
import type { Vector3Value } from "@/types/three";

const animationDurations = { short: 0.35, standard: 0.6, camera: 1.2 } as const;

export function fadeIn(target: gsap.TweenTarget): gsap.core.Tween { return gsap.fromTo(target, { autoAlpha: 0 }, { autoAlpha: 1, duration: animationDurations.standard, ease: "power2.out" }); }
export function slideUp(target: gsap.TweenTarget): gsap.core.Tween { return gsap.fromTo(target, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: animationDurations.standard, ease: "power2.out" }); }
export function counter(target: { value: number }, value: number): gsap.core.Tween { return gsap.to(target, { value, duration: animationDurations.standard, ease: "power1.out" }); }
export function panelReveal(target: gsap.TweenTarget): gsap.core.Tween { return gsap.fromTo(target, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: animationDurations.standard, ease: "power2.out" }); }
export function cameraTransition(target: Vector3Value, destination: Vector3Value): gsap.core.Tween { return gsap.to(target, { ...destination, duration: animationDurations.camera, ease: "power2.inOut" }); }
export const gsapAnimationDurations = animationDurations;
