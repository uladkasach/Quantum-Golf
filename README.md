# Quantum-Golf

## Youtube Demo:
[![Gameplay Demo](https://img.youtube.com/vi/RqZcRy-_MCc/0.jpg)](https://www.youtube.com/watch?v=RqZcRy-_MCc)

## Overview
game idea:
- golf with an electron
    - tunnel through obstacles
    - keep your particle from disappearing due to becoming "too uncertain" to plot by making it to electron traps
    - use protons and other point charges to help guide your electron to its destination

implements:
- Heisenberg uncertainty principle, effects on velocity and position
- Tunneling, through probabilistic collisions *[In Progress]*
- Coulomb forces *[In Progress]*

## Installation
1. run `./install.sh`
    - `chmod +x ./install.sh` if file is not executed
    - installs the npm packages required to run the clientside program as well as the basic http-server to serve the files
2. start the node server with `./start.sh`
3. navigate to `localhost:8080/src/`
    - server is hosting the game at that address

## Play
- use mouse and scrolling to adjust the view so you can see everything
- direct the particle with `left-arrow`, `right-arrow` or `a`, `d`
- modify launch velocity with `w`, `d`
- modify velocity certainty with `up-arrow`, `down-arrow`
    - the more certain your velocity, the faster your particle becomes "too uncertain"
- launch with `space`

## Quantum Game Play Caveats
- higher certainty in velocity reduces the certainty in position (Heisenberg Uncertainty Principle)
    - this makes it so that the particle position becomes uncertain faster
    - SO: although you will be more certain in which direction the particle will go, the particle will not be able to travel as far!

## Libraries Used
- Babylon.js
    - simplifies webgl usage
    - supports collision detection
    - suports meshes and materials
    - supports importing models
- clientside-require
    - implements npm compatable, node style require() and import() statements in the browser
