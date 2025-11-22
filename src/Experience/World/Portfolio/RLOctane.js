import * as THREE from 'three'
import Experience from '../../Experience.js'
import { mod } from 'three/tsl'

export default class RLOctane
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
            this.debugFolder = this.debug.ui.addFolder('RLOctane')
        }

        
        this.resource = this.resources.items.rlOctane

        this.setModel()
    }

    setModel()
    {        
        this.model = this.resource.scene
        this.experience.world.groupPortfolio.add(this.model) 
        this.emptyOctane = this.model.children[0]

        // Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {

            child.userData.parentInstance = this;

            if(child instanceof THREE.Mesh)
            {
                if (child.material) {
                    child.material = this.experience.world.unlimitedTexture.bakedMaterialPortfolio
                }
            }
            
        });

        // Add object to raycast
        // this.experience.objectsIntersectRight.addObject(this.model)
    
        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.castShadow = true
        //     }
        // })

        // this.experience.renderer.addSelectedObject(this.model)

    }
}