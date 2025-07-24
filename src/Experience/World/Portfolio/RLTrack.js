import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class RLTrack
{
    constructor()
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.lastAnimationChange = 0 // en millisecondes
        this.animationChangeCooldown = 3000 // 3 secondes

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('RLTrack')
        }

        
        this.resource = this.resources.items.rlTrack

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {        
        this.model = this.resource.scene
        this.experience.world.groupPortfolio.add(this.model)

        console.log(this.resource);
        
        

        // Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {
            child.userData.parentInstance = this;
        });

        // Add object to raycast
        this.experience.objectsIntersectRight.addObject(this.model)
    
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}

        
        const emptyFennec = this.model.children[0].children.find(child => child.name === "EmptyFennec")
        const emptyOctane = this.model.children[0].children.find(child => child.name === "EmptyOctane")
        
        // // Mixer
        this.animation.mixerFennec = new THREE.AnimationMixer(emptyFennec)
        this.animation.mixerOctane = new THREE.AnimationMixer(emptyOctane)
        
        // // Actions
        this.animation.actions = {}        
        
        this.animation.actions.fennecAction = this.animation.mixerFennec.clipAction(this.resource.animations[0])
        this.animation.actions.octaneAction = this.animation.mixerOctane.clipAction(this.resource.animations[1])

        this.animation.actions.fennecAction.play()
        this.animation.actions.octaneAction.play()  
        
    }

    playAnimation()
    {
        if (this.time.elapsed - this.lastAnimationChange < this.animationChangeCooldown)
            return

        this.lastAnimationChange = this.time.elapsed

        const fAction = this.animation.actions.fennecAction
        const oAction = this.animation.actions.octaneAction

        const actions = [
            this.animation.actions.fennecAction,
            this.animation.actions.octaneAction
        ]

        const randomAction = actions[Math.floor(Math.random() * actions.length)]

        const possibleSpeeds = [0.4, 1.5, 3]
        const newSpeed = possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
        randomAction.timeScale = newSpeed

        // console.log(`Action : ${randomAction._clip.name}, Vitesse : ${newSpeed.toFixed(2)}`)    

    }

    update()
    {
        this.animation.mixerFennec.update(this.time.delta * 0.001)      
        this.animation.mixerOctane.update(this.time.delta * 0.001)
    }
}