

- defined the "electron"
	- defined an object that when called creates an "electron" object and attaches it to the scene
		- particle system used to show that electrons position is never known
		- a sphere mesh was created and a material of alpha 0 was attached
			- (sphere mesh is used to detect collisions)
		- particle system and sphere mesh are both moved
			- parenting the particle system to the sphere mesh produced problems
	- defined a "move" functionality
		- updates the position of the electron based on velocity
    		- velocity is updated by the "obey_uncertainty_principle" function
    		- if velocity is zero (e.g., object is stationary) position doesnt change
	- defined "obey_uncertainty_principle" function
		- update scale of electron:
			1. based on the "uncertainty" in velocity, derive uncertainty of position
				- (using schrodingers equation of a gaussian wave packet (a particle with energy greater than environment) ),
			2. update scale of electron representation based on uncertainty of position
                - use a proportionality constant
        - update velocity of electron:
            1. extract the uncertainty in velocity
            2. calculate a random update to each velocity direction
                1. calculate a random number between [-uncertainty/2, uncertainty/2] where uncertainty ranges from 0 to 1.
                2. scale that random number by the magnitude of velocity user selected
                3. update velocity by that random scaled number
                    - result is that the velocity in each direction can increase or decrease by a value proportional to magnitude_of_velocity * uncertainty
    - defined "launch" function
- defined the "aimer"
    - attaches itself to the electron
    - appends key listeners to get user aiming input:
        - rotation (left, right, a, d)
            - updates the position of a arrow model (imported) to show user which direction they have selected
                - ensure the arrow is always pointing outwards
        - magnitude of velocity (up, down)
        - certainty of velocity (left, right)
    - appends a DOM element that displays the current magnitude and certainty of velocity
        - hides this DOM element when electron is in motion
        - displays this DOM element when electron is aiming
    - extracts the current aiming state and returns when the "get_aim" method is called
- defined a "trap"
    - made to mimic an electron well and look mysterious
    - handles creating the mesh object that appears like a trap
        - two rounded boxes, one slightly larger than the other, "concentric"
        - a material with an alpha
        - an emissive glow
- created a game manager
    - checks every round whether the electron has
        1. disappeared (scale > X)
        2. entered a trap
            - in which case it opens the aiming module
            - checks collisions with `intersectsMesh`
    - handles launching the electron
        - gets aim from aimer, passes it to the electron with launch
    - resets the game if the electron disappears
- created a game play scene (world)
    - has three traps, has a light, has an electron, and begins the game
- setup the framework and directory structure for modularity, re-usability, and readability
    - assets, displays, and worlds directories hold main content
        - assets is all of the elements we could choose to include in a world
        - world is a scene + rendering engine
        - displays is a directory full of overlays that may be placed on the screne
            - e.g., the UI that shows the certainty and magnitude of velocity
    - uses the clientside-require + clientside-view-loader npm packages
        - to modularize code and support loading js files without polluting global scope (node.js style)
        - displays are in particular loaded with the clientside-view-loader utility as it simplifies the process of creating concise display objects.
