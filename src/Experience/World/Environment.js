import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.currentSection = null        
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setLightProfile()
        this.setLightPortfolio()
        
        // this.setEnvironmentMap()
    }

    update()
    {
        this.updateLights()
    }

    mouseOut()
    {
        this.currentSection = null
        gsap.to(this.directionalLightProfile, { intensity: 0, duration: 1, ease: "power2.out" })
        gsap.to(this.directionalLightPortfolio, { intensity: 0, duration: 1, ease: "power2.out" })
    }

    updateLights()
    {        
        if(this.experience.cursor.isMouseOutside)
            return

        const isFirst = this.experience.cursor.isFirstSection

        if (isFirst !== this.currentSection) 
        {
            this.currentSection = isFirst

            if (isFirst) 
            {
                gsap.to(this.directionalLightProfile, { intensity: 1, duration: 1, ease: "power2.out" })
                gsap.to(this.directionalLightPortfolio, { intensity: 0, duration: 1, ease: "power2.out" })
            } else {
                gsap.to(this.directionalLightProfile, { intensity: 0, duration: 1, ease: "power2.out" })
                gsap.to(this.directionalLightPortfolio, { intensity: 1, duration: 1, ease: "power2.out" })
            }
        } 
        
        
    }

    setLightProfile()
    {
        this.ambientLightProfile = new THREE.AmbientLight(0xffffff, 0.2)
        this.sceneProfile.add(this.ambientLightProfile)

        this.directionalLightProfile = new THREE.DirectionalLight(0xffffff, 3)
        this.directionalLightProfile.castShadow = true
        this.directionalLightProfile.shadow.mapSize.set(1024, 1024)
        this.directionalLightProfile.shadow.camera.far = 15
        this.directionalLightProfile.shadow.camera.left = - 7
        this.directionalLightProfile.shadow.camera.top = 7
        this.directionalLightProfile.shadow.camera.right = 7
        this.directionalLightProfile.shadow.camera.bottom = - 7
        this.directionalLightProfile.position.set(5, 5, 5)
        // directionalLight.visible = false
        this.sceneProfile.add(this.directionalLightProfile)

        // Debug
        // if(this.debug.active)
        // {
        //     this.debugFolder
        //         .add(this.sunLight, 'intensity')
        //         .name('sunLightIntensity')
        //         .min(0)
        //         .max(10)
        //         .step(0.001)
            
        //     this.debugFolder
        //         .add(this.sunLight.position, 'x')
        //         .name('sunLightX')
        //         .min(- 5)
        //         .max(5)
        //         .step(0.001)
            
        //     this.debugFolder
        //         .add(this.sunLight.position, 'y')
        //         .name('sunLightY')
        //         .min(- 5)
        //         .max(5)
        //         .step(0.001)
            
        //     this.debugFolder
        //         .add(this.sunLight.position, 'z')
        //         .name('sunLightZ')
        //         .min(- 5)
        //         .max(5)
        //         .step(0.001)
        // }
    }

    setLightPortfolio()
    {
        // this.ambientLightPortfolio = this.ambientLightProfile.clone()
        // this.scenePortfolio.add(this.ambientLightPortfolio)

        this.directionalLightPortfolio = this.directionalLightProfile.clone()
        this.scenePortfolio.add(this.directionalLightPortfolio)
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}