import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class BasePortfolio
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
            this.debugFolder = this.debug.ui.addFolder('BasePortfolio')
        }

        
        this.ressource = this.resources.items.basePortfolio

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
                child.receiveShadow = true
            }
        })
    }
}