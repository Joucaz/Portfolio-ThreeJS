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
        this.videoTV = document.getElementById("videoTV");
        
        this.videoTV.play();
        
        console.log("Video ready:", this.videoTV);
        
        this.videoTVTexture = new THREE.VideoTexture(this.videoTV);
        this.videoTVTexture.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture.center.set(0.5, 0.5);
        // this.videoTexture.rotation = Math.PI; // 180°
        this.videoTVTexture.repeat.y = -1;
        this.videoTVTexture.offset.y = 1;
        
        this.videoTVTexture.minFilter = THREE.LinearFilter;
        this.videoTVTexture.magFilter = THREE.LinearFilter;
        this.videoTVTexture.generateMipmaps = false;

        this.videoTVTexture.needsUpdate = true;

        
        this.logoBouncing = document.getElementById("JCLogoBouncing");
                
        this.logoBouncing.play();
        
        console.log("Video ready:", this.logoBouncing);
        
        this.logoBouncingTexture = new THREE.VideoTexture(this.logoBouncing);
        this.logoBouncingTexture.colorSpace = THREE.SRGBColorSpace;
        // this.videoTexture2.center.set(0.5, 0.5);
        // this.videoTexture2.rotation = Math.PI; // 180°
        this.logoBouncingTexture.repeat.y = -1;
        this.logoBouncingTexture.offset.y = 1;

        this.logoBouncingTexture.minFilter = THREE.LinearFilter;
        this.logoBouncingTexture.magFilter = THREE.LinearFilter;
        this.logoBouncingTexture.generateMipmaps = false;

        this.logoBouncingTexture.needsUpdate = true;

        this.textures.colorBlender = this.resources.items.blenderTexture
        this.textures.colorBlender.colorSpace = THREE.SRGBColorSpace
        this.textures.colorBlender.flipY = false

        this.textures.colorVSCode = this.resources.items.vscodeTexture
        this.textures.colorVSCode.colorSpace = THREE.SRGBColorSpace
        this.textures.colorVSCode.flipY = false
        
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

        
        this.videoTVMaterial = new THREE.MeshBasicMaterial({
            map: this.videoTVTexture,
            side: THREE.FrontSide,
            toneMapped: false,
        });

        this.logoBouncingMaterial = new THREE.MeshBasicMaterial({
            map: this.logoBouncingTexture,
            side: THREE.FrontSide,
            toneMapped: false,
        });

        this.blenderMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.colorBlender
        })
        this.vscodeMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.colorVSCode
        })

    }
}