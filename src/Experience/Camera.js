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

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(75, this.aspectRatioCamera, 0.1, 100)
        this.instance.position.set(0, 2, 5)
        this.experience.addToBothScene(this.instance)
        // this.sceneProfile.add(this.instance)
        // this.scenePortfolio.add(this.instance)
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
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}