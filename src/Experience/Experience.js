import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'
import Cursor from './Utils/Cursor.js'
import Raycaster from './Utils/Raycaster.js'
import ObjectsIntersect from './World/ObjectsIntersect.js'
import Stats from './Utils/Stats.js'

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.stats = new Stats()
        this.sizes = new Sizes()
        this.time = new Time()
        this.cursor = new Cursor()
        this.sceneProfile = new THREE.Scene()
        this.scenePortfolio = new THREE.Scene()
        this.allScene = [this.sceneProfile, this.scenePortfolio]
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        
        this.objectsIntersectRight = new ObjectsIntersect()
        this.objectsIntersectLeft = new ObjectsIntersect()
        this.world = new World()
        this.raycast = new Raycaster()

        /**
         * Helper
         */
        const axisHelper = new THREE.AxesHelper(5)
        const gridHelper = new THREE.GridHelper(20,20)
        const axisHelper2 = new THREE.AxesHelper(5)
        const gridHelper2 = new THREE.GridHelper(20,20)
        // this.sceneProfile.add(axisHelper)
        // this.sceneProfile.add(gridHelper)
        // this.scenePortfolio.add(axisHelper2)
        // this.scenePortfolio.add(gridHelper2)


        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })

        // Cursor mousemove event
        this.cursor.on('mousemove', () =>
        {
            this.mouseMove()
        })

        // Cursor mouseout event
        this.cursor.on('mouseout', () =>
        {
            this.mouseOut()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.stats.update()
        this.cursor.update()
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.raycast.update()
    }

    mouseMove()
    {

    }

    mouseOut()
    {
        this.world.mouseOut()
    }

    addToBothScene(object)
    {
        this.scenePortfolio.add(object)
        this.sceneProfile.add(object)
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // NEED HELP FOR BOTH SCENE
        // Traverse the whole scene
        for(const scene in this.allScene)
        {
            this.scene.traverse((child) =>
                {
                    // Test if it's a mesh
                    if(child instanceof THREE.Mesh)
                    {
                        child.geometry.dispose()

                        // Loop through the material properties
                        for(const key in child.material)
                        {
                            const value = child.material[key]

                            // Test if there is a dispose function
                            if(value && typeof value.dispose === 'function')
                            {
                                value.dispose()
                            }
                        }
                    }
                })
        }
        
        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }

}