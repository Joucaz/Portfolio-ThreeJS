import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Mouse
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
            this.debugFolder = this.debug.ui.addFolder('Mouse')
        }

        
        this.resource = this.resources.items.mouse

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
        
        this.animation.actions.mouseAction = this.animation.mixer.clipAction(this.resource.animations[0])

        this.isReversed = false;
        
    }

    playAnimation() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        const action = this.animation.actions.mouseAction;
        const duration = this.resource.animations[0].duration;

        action.setLoop(THREE.LoopOnce, 1);      // ← joue une seule fois
        action.clampWhenFinished = true;  

        // Stop proprement avant de rejouer
        action.stop();
        action.reset();

        // Sens de lecture
        if (this.isReversed) {
            action.timeScale = -1;    // joue en arrière
            action.time = duration;   // démarre à la fin
        } else {
            action.timeScale = 1;     // joue normalement
            action.time = 0;          // démarre au début
        }
        this.isReversed = !this.isReversed
        // Lecture
        action.play();

        setTimeout(() => {
            this.isPlaying = false
        }, (this.resource.animations[0].duration) * 1000)
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)      

        // console.log(this.resource.animations[0].duration);
        
    }
}