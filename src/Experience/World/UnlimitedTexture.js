import * as THREE from 'three'
import Experience from '../Experience.js'

export default class UnlimitedTexture
{
    constructor()
    {
        
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('UnlimitedTextures')
        }

        this.textures = {}

        this.setTextureBaseProfile()
        this.setTextureBasePortfolio()
        this.setTextureJordan()

        this.setMaterials()
    }

    setTextureBaseProfile()
    {
        this.textures.colorProfile = this.resources.items.baseProfileTexture
        this.textures.colorProfile.colorSpace = THREE.SRGBColorSpace
        this.textures.colorProfile.flipY = false
    }

    setTextureBasePortfolio()
    {        
        this.textures.colorPortfolio = this.resources.items.basePortfolioTexture
        this.textures.colorPortfolio.colorSpace = THREE.SRGBColorSpace
        this.textures.colorPortfolio.flipY = false
    }

    setTextureJordan()
    {        
        this.textures.colorJordanGreyBlue = this.resources.items.jordanGreyBlueTexture
        this.textures.colorJordanGreyBlue.colorSpace = THREE.SRGBColorSpace
        this.textures.colorJordanGreyBlue.flipY = false

        this.textures.colorJordanRed = this.resources.items.jordanRedTexture
        this.textures.colorJordanRed.colorSpace = THREE.SRGBColorSpace
        this.textures.colorJordanRed.flipY = false

        this.textures.colorJordanPurple = this.resources.items.jordanPurpleTexture
        this.textures.colorJordanPurple.colorSpace = THREE.SRGBColorSpace
        this.textures.colorJordanPurple.flipY = false

    }

    setMaterials()
    {
        this.bakedMaterialPortfolio = new THREE.MeshBasicMaterial({
            map: this.textures.colorPortfolio,
        })
        this.bakedMaterialPortfolio.color.setScalar(0.04);

        this.bakedMaterialProfile = new THREE.MeshBasicMaterial({
            map: this.textures.colorProfile,
        })
        this.bakedMaterialProfile.color.setScalar(0.04);

        this.bakedMaterialJordan = new THREE.MeshBasicMaterial({
            map: this.textures.colorJordanGreyBlue,
        })
        this.bakedMaterialJordan.color.setScalar(0.04);

    }
}