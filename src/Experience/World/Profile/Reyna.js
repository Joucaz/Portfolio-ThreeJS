import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Reyna
{
    constructor()
    {
        this.experience = new Experience()
        this.sceneProfile = this.experience.sceneProfile
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.isPlaying = false;

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Reyna')
        }

        
        this.resource = this.resources.items.reyna

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        console.log(this.resource);
        
        this.model = this.resource.scene
        this.experience.world.groupProfile.add(this.model)

        // 🟢 Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {
            child.userData.parentInstance = this;
        });

        // Add object to raycast
        this.experience.objectsIntersectLeft.addObject(this.model)
    
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
                
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}        
        
        this.animation.actions.reynaAction = this.animation.mixer.clipAction(this.resource.animations[0])        
        
    }

    playAnimation()
    {
        if (this.isPlaying) return;

        const action = this.animation.actions.reynaAction;

        action.reset();                         // ← remet à la frame 0
        action.setLoop(THREE.LoopOnce, 1);      // ← joue une seule fois
        action.clampWhenFinished = true;        // ← reste sur la dernière frame
        this.isPlaying = true;
        action.play();   
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        if (this.isPlaying && this.animation.actions.reynaAction.time >= this.resource.animations[0].duration) {
            console.log("finish");
            
            this.isPlaying = false;
        }
    }
}