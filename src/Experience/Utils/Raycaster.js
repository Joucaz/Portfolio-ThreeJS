import * as THREE from 'three'
import Experience from "../Experience";

// let instance = null

export default class Raycaster
{
    constructor()
    {
        // Singleton
        // if(instance)
        // {
        //     return instance
        // }
        this.instance = new THREE.Raycaster()
        this.experience = new Experience()
        this.cursor = this.experience.cursor
        this.x = 0
        this.y = 0
        this.objectsIntersectLeft = this.experience.objectsIntersectLeft
        this.objectsIntersectRight = this.experience.objectsIntersectRight
        // getCursorForRaycast()

        // this.sendRaycast()
    }

    getCursorForRaycast(section)
    {
        this.y = this.cursor.y // Y reste inchangé

        if (section === 'left') {
            // Remap x de [-1, 0] vers [-1, 1]
            this.x = (this.cursor.x + 1) * 2 - 1 
        } else if (section === 'right') {
            // Remap x de [0, 1] vers [-1, 1]
            this.x = (this.cursor.x - 0.5) * 2
        }
    }

    sendRaycast()
    {             
        if(this.cursor.isFirstSection)
        {
            this.getCursorForRaycast("left")
            this.instance.setFromCamera(new THREE.Vector2(this.x, this.y), this.experience.camera.instance)
            this.objectsIntersectLeft.resultIntersectObjects = this.instance.intersectObjects(this.objectsIntersectLeft.objects)
            // console.log(this.objectsIntersectLeft.resultIntersectObjects);
        }
        else
        {
            this.getCursorForRaycast("right")
            this.instance.setFromCamera(new THREE.Vector2(this.x, this.y), this.experience.camera.instance)
            this.objectsIntersectRight.resultIntersectObjects = this.instance.intersectObjects(this.objectsIntersectRight.objects)
            // console.log(this.objectsIntersectRight.resultIntersectObjects);
        }
    }

    update()
    {
        this.sendRaycast()
    }
}