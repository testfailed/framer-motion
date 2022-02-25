import {
    clamp,
    cubicBezier,
    distance,
    interpolate,
    mix,
    progress,
} from "popmotion"
import { LightOptions, ShadowOptions, ShadowTemplate } from "../types"
import { shadowLength } from "./shadow-length"
import { color as colorType } from "style-value-types"

const maxSpread = 5
const minNumShadows = 3
const maxNumShadows = 10

const zeroPoint = { x: 0, y: 0 }
const calcDistance = (x: number, y: number) => distance(zeroPoint, { x, y })

const ease = cubicBezier(0.7, 0.1, 0.9, 0.3)
const opacityEase = cubicBezier(0.1, 0.5, 0.9, 0.5)

function applyIntensity(length: number, intensity: number) {
    const portion = length * 0.25
    return mix(length - portion, length + portion, intensity)
}

export function generateShadow(
    {
        xAngle,
        yAngle,
        z,
        diffusion,
        focus,
        intensity,
        layerZ,
        color,
    }: LightOptions & ShadowOptions,
    template: ShadowTemplate,
    delimiter: string
) {
    let shadow = ""

    /**
     * TODO Some of this can be calculated in Light's useMemo
     * Rename diffusion -> focus
     */
    const zProgress = progress(0, z, layerZ)

    const minOpacity = mix(0, 0.7, diffusion)
    const maxOpacity = mix(
        mix(0.46, 0.62, zProgress),
        mix(0.23, 0.08, zProgress),
        diffusion
    )

    let targetXLength = shadowLength(xAngle, layerZ)
    targetXLength = applyIntensity(targetXLength, intensity)
    let targetYLength = shadowLength(yAngle, layerZ)
    targetYLength = applyIntensity(targetYLength, intensity)
    const targetDistance = calcDistance(targetXLength, targetYLength)

    const maxBlur = interpolate(
        [0, 0.5, 1],
        [targetDistance * 5, targetDistance, 0]
    )(focus)
    // const maxBlur = mix(0, targetDistance * 10, 1 - focus)

    const factor = mix(1, 10, focus)
    // const numShadows = Math.round(
    //     clamp(minNumShadows, maxNumShadows, targetDistance / factor)
    // )
    const numShadows = 10
    const compoundOpacityFactor = 0.7
    // clamp(
    //     0.2,
    //     1,
    //     progress(maxNumShadows, minNumShadows, numShadows)
    // )

    const parsedColor = colorType.parse(color)
    const targetSpread = mix(0, -maxSpread, diffusion)

    for (let i = 1; i <= numShadows; i++) {
        const p = progress(0, numShadows, i)
        const easedP = ease(p)

        parsedColor.alpha =
            mix(maxOpacity, minOpacity, opacityEase(p)) * compoundOpacityFactor
        const colorString = colorType.transform!(parsedColor)
        const xLength = mix(0, targetXLength, easedP)
        const yLength = mix(0, targetYLength, easedP)
        const spread = mix(0, targetSpread, p)
        const blur = mix(0, maxBlur, easedP)

        // TODO: Eased transpareny

        shadow += template(xLength, yLength, blur, spread, colorString)

        if (i !== numShadows) shadow += delimiter
    }

    return shadow
}
