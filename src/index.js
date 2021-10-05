import {
    Bodies,
    Body,
    Common,
    Composite,
    Engine,
    Mouse,
    MouseConstraint,
    Render,
    Runner,
    Vector,
} from 'matter-js'

import './index.css'

function makeLeftWallPosition(wallWidth) {
    return Vector.create(-wallWidth / 2, window.innerHeight / 2)
}

function makeRightWallPosition(wallWidth) {
    return Vector.create(window.innerWidth + wallWidth / 2, window.innerHeight / 2)
}

function makeTopWallPosition(wallWidth) {
    return Vector.create(window.innerWidth / 2, -wallWidth / 2)
}

function makeBottomWallPosition(wallWidth) {
    return Vector.create(window.innerWidth / 2, window.innerHeight + wallWidth / 2)
}

function makeRandomBallPosition(radius) {
    const x = Common.random(0 + radius, window.innerWidth - radius)
    const y = Common.random(0 + radius, window.innerHeight - radius)
    return Vector.create(x, y)
}

function resize() {
    render.bounds.max.x = render.options.width = render.canvas.width = window.innerWidth
    render.bounds.max.y = render.options.height = render.canvas.height = window.innerHeight
    Body.setPosition(leftWall, makeLeftWallPosition(wallWidth))
    Body.setPosition(rightWall, makeRightWallPosition(wallWidth))
    Body.setPosition(topWall,  makeTopWallPosition(wallWidth))
    Body.setPosition(bottomWall,  makeBottomWallPosition(wallWidth))
}

function hasBodyEscaped(body) {
    const x = body.position.x
    const y = body.position.y
    return x < 0 || x > render.canvas.width || y < 0 || y > render.canvas.height
}

function repositionEscapedBall() {
    setInterval(() => {
        if (hasBodyEscaped(ball)) {
            Body.setPosition(ball, makeRandomBallPosition(ballRadius))
        }
    }, 100)
}

const engine = Engine.create()
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        background: 'rgb(255, 255, 255)',
        wireframes: false,
        width: window.innerWidth,
        height: window.innerHeight,
    }
})
const runner = Runner.create()

const wallWidth = 100
const wallOptions = {
    isStatic: true,
    render: {
        fillStyle: 'rgb(255, 255, 255)',
    }
}
const ballRadius = 100
const ballOptions = {
    restitution: 1,
}

const leftWallXY = makeLeftWallPosition(wallWidth)
const rightWallXY = makeRightWallPosition(wallWidth)
const topWallXY = makeTopWallPosition(wallWidth)
const bottomWallXY = makeBottomWallPosition(wallWidth)
const ballXY = makeRandomBallPosition(ballRadius)

const leftWall = Bodies.rectangle(leftWallXY.x, leftWallXY.y, wallWidth, window.innerHeight, wallOptions)
const rightWall = Bodies.rectangle(rightWallXY.x, rightWallXY.y, wallWidth, window.innerHeight, wallOptions)
const topWall = Bodies.rectangle(topWallXY.x, topWallXY.y, window.innerWidth, wallWidth, wallOptions)
const bottomWall = Bodies.rectangle(bottomWallXY.x, bottomWallXY.y, window.innerWidth, wallWidth, wallOptions)
const walls = [leftWall, rightWall, topWall, bottomWall]
const ball = Bodies.circle(ballXY.x, ballXY.y, ballRadius, ballOptions)

const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {
            visible: false
        }
    }
})
render.mouse = mouse

Composite.add(engine.world, [
    ...walls,
    ball,
    mouseConstraint,
])

Render.run(render)
Runner.run(runner, engine)

window.addEventListener('resize', resize)
repositionEscapedBall()
resize()
