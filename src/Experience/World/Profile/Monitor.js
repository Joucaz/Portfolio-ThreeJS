import * as THREE from 'three'
import Experience from '../../Experience.js'
import { logarithmicDepthToViewZ } from 'three/tsl'

export default class Monitor
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
            this.debugFolder = this.debug.ui.addFolder('Monitor')
        }

        
        this.resource = this.resources.items.monitor

        this.setMaterialVideo()
        this.setModel()
        this.setMaterial()
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
        // this.experience.objectsIntersectLeft.addObject(this.model)
    
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

        this.video2 = document.getElementById("video2");
        
        this.video2.play();

        // console.log("Video ready:", this.video);

        this.videoTexture2 = new THREE.VideoTexture(this.video2);
        this.videoTexture2.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture2.center.set(0.5, 0.5);
        // this.videoTexture2.rotation = Math.PI; // 180°
        this.videoTexture2.repeat.y = -1;
        this.videoTexture2.offset.y = 1;

        this.videoMaterial2 = new THREE.MeshStandardMaterial({
            map: this.videoTexture2,
            side: THREE.FrontSide,
            toneMapped: false
        });

    }

    setMaterial()
    {
        this.screenPC = this.model.children[0].children[1];

        // this.screenPC.material = this.videoMaterial;        
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

    

    update()
    {
        if(this.videoTexture)
        {
            this.videoTexture.needsUpdate = true;
        }
        if(this.videoTexture2)
        {
            this.videoTexture2.needsUpdate = true;
        }

        if(this.experience.world.pc.isOpen){
            this.screenPC.material = this.videoMaterial;   
        }
        else{
            this.screenPC.material = this.videoMaterial2;   
        }       
        
    }

}