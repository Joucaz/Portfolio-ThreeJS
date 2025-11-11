import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class TVScreen
{
    constructor()
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('TVScreen')
        }

        
        this.ressource = this.resources.items.tvScreen

        this.setMaterialVideo()    
        this.setModel()
    }

    setModel()
    {
        this.model = this.ressource.scene
        this.experience.world.groupPortfolio.add(this.model)
    
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                // child.receiveShadow = true
                // child.castShadow = true

                if (child.material) {
                    child.material = this.videoMaterial
                }

                // if (child.geometry.attributes.uv) {
                //     child.material = new THREE.MeshStandardMaterial({
                //         map: this.textures.color,
                //     })
                // }
            }
        })
    }

    setMaterialVideo()
    {
        this.video = document.getElementById("video");
        
        this.video.play();

        console.log("Video ready:", this.video)

        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture.center.set(0.5, 0.5);
        // this.videoTexture.rotation = Math.PI; // 180°
        this.videoTexture.repeat.y = -1;
        this.videoTexture.offset.y = 1;


        this.videoMaterial = new THREE.MeshBasicMaterial({
            map: this.videoTexture,
            side: THREE.FrontSide,
            toneMapped: false
        });

    }

    update()
    {
        if(this.videoTexture)
        {
            this.videoTexture.needsUpdate = true;
        }
    }
    
}