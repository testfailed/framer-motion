export interface LightOptions {
    xAngle: number
    yAngle: number
    z: number
    diffusion: number
    focus: number
    intensity: number
}

export interface ShadowOptions {
    layerZ: number
    color: string
}

export type ShadowTemplate = (
    xLength: number,
    yLength: number,
    blur: number,
    spread: number,
    color: string
) => string
