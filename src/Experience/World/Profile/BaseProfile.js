import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class BaseProfile
{
    constructor()
    {
        this.experience = new Experience()
        this.sceneProfile = this.experience.sceneProfile
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
    
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }
}