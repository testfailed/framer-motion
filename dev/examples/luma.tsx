import * as React from "react"
import { Light, useShadow, useLight } from "luma"
import { motion, useMotionValue } from "framer-motion"
import { useRef, useState } from "react"
import styled from "styled-components"
import { Point } from "popmotion/lib/types"
import { clamp } from "popmotion"

const Box = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 20px;
    background: white;
    font-family: Dank Mono;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Container = styled.div`
    position: fixed;
    inset: 0;
    background: #7fc3ff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
`

function Child({ z = 10, shadowColor = "rgba(0,0,0)" }) {
    // const boxShadow = useShadow(z, shadowColor)

    const boxShadow = `1px 1px 0 #eee, ` + useShadow(z, shadowColor)

    return <Box style={{ boxShadow }}>{`z: ${z}px`}</Box>
}

export function App() {
    const [x, setX] = useState(-20)
    const [y, setY] = useState(-40)
    const [diffusion, setDiffusion] = useState(0.5)
    const [intensity, setIntensity] = useState(0.5)
    const [focus, setFocus] = useState(0.5)
    const [height, setHeight] = useState(0)

    return (
        <Light
            xAngle={x}
            yAngle={y}
            diffusion={diffusion}
            intensity={intensity}
            focus={focus}
        >
            <Container>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <label style={{ marginRight: 20 }}>
                        {`diffusion`}
                        <input
                            value={diffusion}
                            type="range"
                            min="0"
                            max="1"
                            step={0.001}
                            onChange={(e) =>
                                setDiffusion(parseFloat(e.target.value))
                            }
                        />
                    </label>
                    <label style={{ marginRight: 20 }}>
                        {`intensity`}
                        <input
                            value={intensity}
                            type="range"
                            min="0"
                            max="1"
                            step={0.001}
                            onChange={(e) =>
                                setIntensity(parseFloat(e.target.value))
                            }
                        />
                    </label>
                    <label style={{ marginRight: 20 }}>
                        {`focus`}
                        <input
                            value={focus}
                            type="range"
                            min="0"
                            max=".8"
                            step={0.001}
                            onChange={(e) =>
                                setFocus(parseFloat(e.target.value))
                            }
                        />
                    </label>
                    <ShadowControl
                        value={{ x, y }}
                        onXChange={(latest) => setX(clamp(-80, 80, latest))}
                        onYChange={(latest) => setY(clamp(-80, 80, latest))}
                    />
                </div>
                <div style={{ display: "flex", gap: 50, perspective: 200 }}>
                    <Child z={5} shadowColor={"hsl(212, 50%, 20%)"} />
                    <Child z={10} shadowColor={"hsl(212, 50%, 20%)"} />
                    <Child z={30} shadowColor={"hsl(212, 50%, 20%)"} />
                    <div
                        style={{
                            perspective: 200,
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Child z={height} shadowColor={"hsl(212, 50%, 20%)"} />
                        <label
                            style={{
                                marginRight: 20,
                                transform: "translateY(100px)",
                                display: "block",
                            }}
                        >
                            {`height`}
                            <input
                                value={height}
                                type="range"
                                min="0"
                                max="100"
                                step={1}
                                onChange={(e) =>
                                    setHeight(parseFloat(e.target.value))
                                }
                            />
                        </label>
                    </div>
                </div>
            </Container>
        </Light>
    )
}

const width = 150
const height = 150
function ShadowControl({ value, onXChange, onYChange }) {
    const x = useMotionValue(value.x)
    const y = useMotionValue(value.y)
    React.useEffect(() => x.onChange(onXChange), [onXChange])
    React.useEffect(() => y.onChange(onYChange), [onYChange])

    return (
        <div
            style={{
                width,
                height,
                backgroundColor: "rgba(0,0,0,0.4)",
                borderRadius: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <motion.div
                drag
                dragConstraints={{
                    top: -width / 2,
                    left: -width / 2,
                    bottom: width / 2,
                    right: width / 2,
                }}
                dragElastic={0.2}
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    x,
                    y,
                }}
            />
        </div>
    )
}
