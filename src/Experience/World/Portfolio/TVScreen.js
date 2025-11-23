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
        this.unlimitedTexture = this.experience.world.unlimitedTexture

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('TVScreen')
        }

        
        this.ressource = this.resources.items.tvScreen

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
                    child.material = this.unlimitedTexture.videoTVMaterial
                }

                // if (child.geometry.attributes.uv) {
                //     child.material = new THREE.MeshStandardMaterial({
                //         map: this.textures.color,
                //     })
                // }
            }
        })
    }

    update()
    {
        // if(this.unlimitedTexture.videoPC1Texture)
        // {
        //     this.unlimitedTexture.videoPC1Texture.needsUpdate = true;
        // }
    }
    
}