import * as THREE from 'three'
import Experience from "../Experience";
import { Outlines } from '@pmndrs/vanilla'

export default class OutlinesObject
{
    constructor()
    {
        this.experience = new Experience()         
        this.debug = this.experience.debug

         // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Outlines')
        }

        this.setTestCube()
    }

    setTestCube()
    {
        const geo = new THREE.BoxGeometry(1, 1, 1)
        const mat = new THREE.MeshBasicMaterial({ color: "pourple" })
        this.cube = new THREE.Mesh(geo, mat)
        this.cube.position.set(0, 1, 0)
        this.experience.world.groupProfile.add(this.cube)
        console.log(this.cube)

        // ajoute un outline au cube
        this.addOutline(this.cube)
    }

    addOutline(mesh)
    {
        const outlines = Outlines({ 
            color: new THREE.Color("white"), 
            thickness: 0.005, 
            opacity: 1, 
            transparent: false, 
            angle: 0, 
            screenspace: false, })
        mesh.add(outlines.group)
    
        // must call generate() to create the outline mesh
        outlines.generate()
    }
        
}