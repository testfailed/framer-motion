import { degreesToRadians } from "popmotion"

export function shadowLength(angle: number, z: number) {
    return Math.tan(degreesToRadians(angle * -1)) * z
}
