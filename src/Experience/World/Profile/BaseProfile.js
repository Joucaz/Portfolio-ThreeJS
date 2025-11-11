import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class BaseProfile
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
            this.debugFolder = this.debug.ui.addFolder('BaseProfile')
        }

        
        this.ressource = this.resources.items.baseProfile

        this.setModel()        
    }

    setModel()
    {
        this.model = this.ressource.scene
        this.experience.world.groupProfile.add(this.model)

        // this.model.matrixAutoUpdate = false
    
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                // child.receiveShadow = true
                // child.castShadow = true

                if (child.material) {
                    child.material = this.experience.world.unlimitedTexture.bakedMaterialProfile
                }

                // if (child.geometry.attributes.uv) {
                //     child.material = new THREE.MeshStandardMaterial({
                //         map: this.textures.color,
                //     })
                // }
            }
        })
    }
}