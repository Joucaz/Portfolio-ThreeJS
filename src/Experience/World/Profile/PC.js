import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class PC
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
            this.debugFolder = this.debug.ui.addFolder('PC')
        }

        
        this.resource = this.resources.items.pc

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

    // setAnimation()
    // {
    //     this.animation = {}
                
    //     // Mixer
    //     this.animation.mixer = new THREE.AnimationMixer(this.model)
    //     console.log(this.animation.mixer);
    //     console.log(this.resource.animations);
        
        
        
    //     // Actions
    //     this.animation.actions = {}        
        
    //     this.animation.actions.pcActionScreen = this.animation.mixer.clipAction(this.resource.animations[0])
    //     this.animation.actions.pcActionDisplay = this.animation.mixer.clipAction(this.resource.animations[1])

    //     // Look when animation is finish with an event
    //     // this.animation.mixer.addEventListener('finished', () => {
    //     //     console.log("finish");
            
    //     //     this.isPlaying = false
    //     // })
        
    // }

    // playAnimation()
    // {
    //     if (this.isPlaying) return;

    //     const action = this.animation.actions.pcActionScreen;

    //     action.reset();                         // ← remet à la frame 0
    //     action.setLoop(THREE.LoopOnce, 1);      // ← joue une seule fois
    //     action.clampWhenFinished = true;        // ← reste sur la dernière frame
    //     this.isPlaying = true;
    //     action.play();   
    // }

    // update()
    // {
    //     this.animation.mixer.update(this.time.delta * 0.001)      

    //     // console.log(this.resource.animations[0].duration);
        
        
    //     // Look when animation is finish
    //     if (this.isPlaying && this.animation.actions.pcAction.time >= this.resource.animations[0].duration) {
    //         this.isPlaying = false;
    //     }
    // }

    setAnimation()
    {
        this.animation = {}

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}        
        this.animation.actions.pcActionScreen = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.pcActionDisplay = this.animation.mixer.clipAction(this.resource.animations[1])

        // État d'animation
        this.isPlaying = false
        this.isReversed = false
    }

    playAnimation()
    {
        if (this.isPlaying) return
        this.isPlaying = true

        // On récupère les deux actions
        const screenAction = this.animation.actions.pcActionScreen
        const displayAction = this.animation.actions.pcActionDisplay

        // Réinitialisation
        screenAction.reset()
        displayAction.reset()

        // Config commune
        screenAction.setLoop(THREE.LoopOnce, 1)
        displayAction.setLoop(THREE.LoopOnce, 1)
        screenAction.clampWhenFinished = true
        displayAction.clampWhenFinished = true

        // Gestion du sens (normal / inversé)
        const timeScale = this.isReversed ? -1 : 1
        screenAction.timeScale = timeScale
        displayAction.timeScale = timeScale

        // Si on joue à l'envers, on démarre à la fin
        if (this.isReversed) {
            screenAction.time = this.resource.animations[0].duration
            displayAction.time = this.resource.animations[1].duration
        }

        // Lecture simultanée 🎬
        screenAction.play()
        displayAction.play()

        // Inverser le sens pour la prochaine fois
        this.isReversed = !this.isReversed

        // Quand les deux sont terminées, on remet isPlaying à false
        const maxDuration = Math.max(
            this.resource.animations[0].duration,
            this.resource.animations[1].duration
        )

        setTimeout(() => {
            this.isPlaying = false
        }, (maxDuration + 2) * 1000)
    }

    update()
    {
        // Met à jour le mixer
        this.animation.mixer.update(this.time.delta * 0.001)
    }

}