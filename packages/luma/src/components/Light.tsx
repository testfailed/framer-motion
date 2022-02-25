import * as React from "react"
import { createContext, useMemo } from "react"
import { LightOptions } from "../types"

const defaults = {
    xAngle: -10,
    yAngle: -20,
    z: 30,
    diffusion: 0.5,
    intensity: 0.5,
    focus: 0.5,
}

export const LightContext = createContext(defaults)

export function Light({
    children,
    xAngle = defaults.xAngle,
    yAngle = defaults.yAngle,
    z = defaults.z,
    diffusion = defaults.diffusion,
    focus = defaults.focus,
    intensity = defaults.intensity,
}: Partial<LightOptions> & { children: any }) {
    const context = useMemo(
        () => ({
            xAngle,
            yAngle,
            z,
            diffusion,
            intensity,
            focus,
        }),
        [xAngle, yAngle, z, diffusion, intensity, focus]
    )

    return (
        <LightContext.Provider value={context}>
            {children}
        </LightContext.Provider>
    )
}
