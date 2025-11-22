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
        this.setTextureVideo()

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

    setTextureVideo()
    {
        this.videoPC1 = document.getElementById("videoPC1");
                
        this.videoPC1.play();
        
        console.log("Video ready:", this.videoPC1);
        
        this.videoPC1Texture = new THREE.VideoTexture(this.videoPC1);
        this.videoPC1Texture.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture.center.set(0.5, 0.5);
        // this.videoTexture.rotation = Math.PI; // 180°
        this.videoPC1Texture.repeat.y = -1;
        this.videoPC1Texture.offset.y = 1;
        
        
        this.logoBouncing = document.getElementById("JCLogoBouncing");
                
        this.logoBouncing.play();
        
        console.log("Video ready:", this.logoBouncing);
        
        this.logoBouncingTexture = new THREE.VideoTexture(this.logoBouncing);
        this.logoBouncingTexture.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture2.center.set(0.5, 0.5);
        // this.videoTexture2.rotation = Math.PI; // 180°
        this.logoBouncingTexture.repeat.y = -1;
        this.logoBouncingTexture.offset.y = 1;
        
    }

    setMaterials()
    {
        this.bakedMaterialPortfolio = new THREE.MeshBasicMaterial({
            map: this.textures.colorPortfolio,
        })
        this.bakedMaterialPortfolio.color.setScalar(0.02);

        this.bakedMaterialProfile = new THREE.MeshBasicMaterial({
            map: this.textures.colorProfile,
        })
        this.bakedMaterialProfile.color.setScalar(0.02);

        this.bakedMaterialJordan = new THREE.MeshBasicMaterial({
            map: this.textures.colorJordanGreyBlue,
        })
        this.bakedMaterialJordan.color.setScalar(0.02);

        
        this.videoPC1Material = new THREE.MeshBasicMaterial({
            map: this.videoPC1Texture,
            side: THREE.FrontSide,
            toneMapped: false,
        });

        this.logoBouncingMaterial = new THREE.MeshBasicMaterial({
            map: this.logoBouncingTexture,
            side: THREE.FrontSide,
            toneMapped: false,
        });

    }
}