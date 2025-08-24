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

        this.debugObject = {}

        this.intensityAmbientLight = 0.2
        this.intensityAmbientLightOff = 0
        this.intensityDirectionnalLight = 3
        this.intensityDirectionnalLightOff = 0.08
        // this.intensityDirectionnalLight = 0
        // this.intensityDirectionnalLightOff = 0
        
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
        
        gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })
        gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })

        gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
        gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
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
                gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLight, duration: 1, ease: "power2.out" })
                gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })

                gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLight, duration: 1, ease: "power2.out" })
                gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
            } 
            else 
            {
                gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })
                gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLight, duration: 1, ease: "power2.out" })

                gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
                gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLight, duration: 1, ease: "power2.out" })
            }
        } 
        
        
    }

    setLightProfile()
    {
        // Ambient Light (0xffffff, 0.2)
        this.ambientLightProfile = new THREE.AmbientLight(0xffffff, this.intensityAmbientLightOff)
        this.sceneProfile.add(this.ambientLightProfile)


        // Directional Light (0xffffff, 3)
        this.directionalLightProfile = new THREE.DirectionalLight(0xffffff, this.intensityDirectionnalLightOff)
        // this.directionalLightProfile.castShadow = true
        this.directionalLightProfile.shadow.mapSize.set(1024, 1024)
        this.directionalLightProfile.shadow.camera.far = 15
        this.directionalLightProfile.shadow.camera.left = - 7
        this.directionalLightProfile.shadow.camera.top = 7
        this.directionalLightProfile.shadow.camera.right = 7
        this.directionalLightProfile.shadow.camera.bottom = - 7
        this.directionalLightProfile.position.set(5, 5, 5)
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

        // this.directionalLightPortfolio = this.directionalLightProfile.clone()
        // this.scenePortfolio.add(this.directionalLightPortfolio)

        this.ambientLightPortfolio = new THREE.AmbientLight(0xffffff, this.intensityAmbientLightOff)
        this.scenePortfolio.add(this.ambientLightPortfolio)

        this.directionalLightPortfolio = new THREE.DirectionalLight(0xffffff, this.intensityDirectionnalLightOff)
        // this.directionalLightPortfolio.castShadow = true
        this.directionalLightPortfolio.shadow.mapSize.set(1024, 1024)
        this.directionalLightPortfolio.shadow.camera.far = 15
        this.directionalLightPortfolio.shadow.camera.left = -7
        this.directionalLightPortfolio.shadow.camera.top = 7
        this.directionalLightPortfolio.shadow.camera.right = 7
        this.directionalLightPortfolio.shadow.camera.bottom = -7
        this.directionalLightPortfolio.position.set(1, 3, 1)
        this.scenePortfolio.add(this.directionalLightPortfolio)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.ambientLightPortfolio, 'intensity')
                .name('ambientLightPortfolio')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.directionalLightPortfolio, 'intensity')
                .name('directionalLightPortfolio')
                .min(0)
                .max(10)
                .step(0.001)            
        }

        // const helper = new THREE.DirectionalLightHelper( this.directionalLightPortfolio, 5 );
        // this.scenePortfolio.add( helper );

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