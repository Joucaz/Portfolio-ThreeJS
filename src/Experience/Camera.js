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
        this.instance = new THREE.PerspectiveCamera(60, this.aspectRatioCamera, 0.1, 100)
        this.instance.position.set(0, 0.2, 3)

        // DON'T WORK WITH ORBIT CONTROLS
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))

        this.experience.addToBothScene(this.instance)

        
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.instance, 'fov')
                .name('FOV')
                .min(0)
                .max(150)
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
                .step(0.01)
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
        console.log(this.instance.aspect);
        
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        // this.controls.update()
    }
}