import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Chair
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
            this.debugFolder = this.debug.ui.addFolder('Chair')
        }

        
        this.resource = this.resources.items.chair

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {        
        this.model = this.resource.scene
        this.experience.world.groupProfile.add(this.model)

        // Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {

            child.userData.parentInstance = this;

            if(child instanceof THREE.Mesh)
            {
                if (child.material) {
                    child.material = this.experience.world.unlimitedTexture.bakedMaterialProfile
                }
            }
        });

        // Add object to raycast
        this.experience.objectsIntersectLeft.addObject(this.model)
    
        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.castShadow = true
        //     }
        // })
    }

    setAnimation()
    {
        this.animation = {}
                
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}        
        
        this.animation.actions.chairAction = this.animation.mixer.clipAction(this.resource.animations[0])

        // Look when animation is finish with an event
        // this.animation.mixer.addEventListener('finished', () => {
        //     console.log("finish");
            
        //     this.isPlaying = false
        // })
        
    }

    playAnimation()
    {
        if (this.isPlaying) return;

        const action = this.animation.actions.chairAction;

        action.reset();                         // ← remet à la frame 0
        action.setLoop(THREE.LoopOnce, 1);      // ← joue une seule fois
        action.clampWhenFinished = true;        // ← reste sur la dernière frame
        this.isPlaying = true;
        action.play();   
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)      

        // console.log(this.resource.animations[0].duration);
        
        
        // Look when animation is finish
        if (this.isPlaying && this.animation.actions.chairAction.time >= this.resource.animations[0].duration) {
            this.isPlaying = false;
        }
    }
}