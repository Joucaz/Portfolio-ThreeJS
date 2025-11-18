import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.canvas = this.experience.canvas
        this.aspectRatioCamera = this.sizes.isMobile ? this.sizes.width / (this.sizes.height / 2) : this.sizes.width / 2 / this.sizes.height
        this.clock = new THREE.Clock()
        this.previousTime = 0

        const baseWidth = 1350 / 2; //1536 total mais j'ai baissé un peu
        const baseHeight = 695;
        this.baseFOV = 60;
        this.baseAspect = baseWidth / baseHeight;
        
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Camera')
        }


        this.setInstance()
        this.setControls()

    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(this.baseFOV, this.aspectRatioCamera, 0.1, 100)
        this.instance.position.set(0, 0.2, 3)

        console.log(this.aspectRatioCamera);
        console.log(this.sizes.width);
        console.log(this.sizes.height);


        // DON'T WORK WITH ORBIT CONTROLS
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))

        this.experience.addToBothScene(this.instance)

        
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.instance, 'fov')
                .name('FOV')
                .min(40)
                .max(100)
                .step(1)
                .onChange((value) => {
                    this.instance.fov = value; // on met à jour le FOV
                    this.instance.updateProjectionMatrix(); // obligatoire pour appliquer le changement
                });
            
            this.debugFolder
                .add(this.instance.position, 'x')
                .name('Position X')
                .min(-10)
                .max(10)
                .step(0.01)
            this.debugFolder
                .add(this.instance.position, 'y')
                .name('Position Y')
                .min(-10)
                .max(10)
                .step(0.01)
            this.debugFolder
                .add(this.instance.position, 'z')
                .name('Position Z')
                .min(-10)
                .max(10)
                .step(0.1)
        }
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.aspectRatioCamera = this.sizes.isMobile ? this.sizes.width / (this.sizes.height / 2) : this.sizes.width / 2 / this.sizes.height
        this.instance.aspect = this.aspectRatioCamera

        const currentAspect = this.sizes.isMobile ? this.sizes.width / (this.sizes.height / 2) : this.sizes.width / 2 / this.sizes.height
        const fovFactor = currentAspect / this.baseAspect;
        this.instance.fov = Math.max(60, Math.min(72, this.baseFOV / fovFactor));
        console.log(this.instance.fov);
        
        
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        
        // const elapsedTime = this.clock.getElapsedTime()
        // const deltaTime = elapsedTime - this.previousTime
        // this.previousTime = elapsedTime

        // const parallaxAmplitude = 0.02
        // const parallaxX = this.experience.cursor.x * parallaxAmplitude
        // const parallaxY = -this.experience.cursor.y * parallaxAmplitude
        // this.instance.position.x += (parallaxX - this.instance.position.x) * 5 * deltaTime
        // this.instance.position.y += (parallaxY - this.instance.position.y) * 5 * deltaTime

        // this.controls.update()
    }
}