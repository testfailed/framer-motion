import { useContext, useMemo } from "react"
import { LightContext } from "../components/Light"
import { ShadowTemplate } from "../types"
import { generateShadow } from "../utils/generate-shadow"

const shadowTemplate: ShadowTemplate = (
    xLength,
    yLength,
    blur,
    spread,
    color
) => `${xLength}px ${yLength}px ${blur}px ${spread}px ${color}`

export function useShadow(layerZ: number, color: string = "rgba(0,0,0,1)") {
    const { xAngle, yAngle, z, diffusion, focus, intensity } =
        useContext(LightContext)

    return useMemo(
        () =>
            generateShadow(
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
                ", "
            ),
        [xAngle, yAngle, z, diffusion, focus, intensity, layerZ, color]
    )
}
