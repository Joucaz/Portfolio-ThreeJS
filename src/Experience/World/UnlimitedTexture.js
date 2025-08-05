import * as THREE from 'three'
import Experience from '../Experience.js'

export default class UnlimitedTexture
{
    constructor()
    {
        
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.textures = {}

        this.setTextureBaseProfile()
        this.setTextureBasePortfolio()

        this.setMaterials()
    }

    setTextureBaseProfile()
    {
        // this.textures.colorProfile = this.resources.items.baseProfileTexture
        // this.textures.colorProfile.colorSpace = THREE.SRGBColorSpace
        // this.textures.colorProfile.flipY = false
    }

    setTextureBasePortfolio()
    {        
        this.textures.colorPortfolio = this.resources.items.basePortfolioTexture
        this.textures.colorPortfolio.colorSpace = THREE.SRGBColorSpace
        this.textures.colorPortfolio.flipY = false
    }

    setMaterials()
    {
        this.bakedMaterialPortfolio = new THREE.MeshStandardMaterial({
            map: this.textures.colorPortfolio,
        })
    }
}