# Quantum-Golf

## Overview
game idea:
- golf with an electron
    - tunnel through obstacles
    - keep your particle from disappearing due to becoming "too uncertain" to plot by making it to electron traps
    - use protons and other point charges to help guide your electron to its destination

game play:
- direct the particle with `left-arrow`, `right-arrow` or `a`, `d`
- modify launch velocity with `w`, `d`
- modify velocity certainty with `up-arrow`, `down-arrow`
    - the more certain your velocity, the faster your particle becomes "too uncertain"
- launch with `space`

implements:
- <s> Heisenberg uncertainty principle, effects on velocity and position
- Tunneling, through probabilistic collisions
- Coulomb forces

## Installation
1. run `./install.sh`
    - `chmod +x ./install.sh` if file is not executed
    - installs the npm packages required to run the clientside program as well as the basic http-server to serve the files
2. start the node server with `./start.sh`
3. navigate to `localhost:8080`
    - server is hosting the game at that address

## Libraries Used
- Babylon.js
    - simplifies webgl usage
    - supports collision detection
    - suports meshes and materials
    - supports importing models
- clientside-require
    - implements npm compatable, node style require() and import() statements in the browser
