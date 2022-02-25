import { clamp } from "popmotion"
import { useContext, useMemo } from "react"
import { LightContext } from "../components/Light"
import { ShadowTemplate } from "../types"
import { generateShadow } from "../utils/generate-shadow"

const shadowTemplate: ShadowTemplate = (
    xLength,
    yLength,
    blur,
    _spread,
    color
) => `drop-shadow(${xLength}px ${yLength}px ${blur}px ${color})`

const additionalBrightness = 20

export function useLight(layerZ: number, color: string = "rgba(0,0,0,1)") {
    const { xAngle, yAngle, z, diffusion, focus, intensity } =
        useContext(LightContext)

    return useMemo(() => {
        const shadow = generateShadow(
            {
                xAngle,
                yAngle,
                z,
                diffusion,
                focus,
                intensity,
                layerZ,
                color,
            },
            shadowTemplate,
            " "
        )

        const punch = clamp(
            0,
            additionalBrightness,
            (layerZ / z) * additionalBrightness
        )

        return (
            shadow +
            ` saturate(${100 + punch}%) brightness(${100 + punch / 2}%)`
        )
    }, [xAngle, yAngle, z, diffusion, focus, intensity, layerZ, color])
}
