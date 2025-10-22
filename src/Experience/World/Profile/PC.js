import * as THREE from 'three'
import Experience from '../../Experience.js'
import { logarithmicDepthToViewZ } from 'three/tsl'

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
        this.isOpen = true;

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('PC')
        }

        
        this.resource = this.resources.items.pc

        this.setMaterialVideo()
        this.setModel()
        this.setMaterial()
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

    setMaterialVideo()
    {
        this.video = document.getElementById("video");
        
        this.video.play();

        // console.log("Video ready:", this.video);

        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture.center.set(0.5, 0.5);
        // this.videoTexture.rotation = Math.PI; // 180°
        this.videoTexture.repeat.y = -1;
        this.videoTexture.offset.y = 1;


        this.videoMaterial = new THREE.MeshStandardMaterial({
            map: this.videoTexture,
            side: THREE.FrontSide,
            toneMapped: false
        });

    }

    setMaterial()
    {
        this.screenPC = this.model.children[0].children[1];     
        this.screenPC.material = this.videoMaterial;
        
    }

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
        

        setTimeout(() => {
            this.isOpen = !this.isOpen;
        }, 1 * 1000)

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
        if(this.videoTexture)
        {
            this.videoTexture.needsUpdate = true;
        }
        // Met à jour le mixer
        this.animation.mixer.update(this.time.delta * 0.001)
    }

}