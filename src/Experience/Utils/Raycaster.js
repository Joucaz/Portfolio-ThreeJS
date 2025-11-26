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
        this.frameCount = 0

        this.raycastInterval = this.experience.sizes.isMobile ? 0 : 6

        this.currentIntersectLeft = null
        this.currentIntersectRight = null
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
        console.log("raycast");
        
        if(this.cursor.isFirstSection)
        {
            this.getCursorForRaycast("left")
            this.instance.setFromCamera(new THREE.Vector2(this.x, this.y), this.experience.camera.instance)
            this.objectsIntersectLeft.resultIntersectObjects = this.instance.intersectObjects(this.objectsIntersectLeft.objects)
            
            if(this.objectsIntersectLeft.resultIntersectObjects.length > 0)
            {
                const hit = this.objectsIntersectLeft.resultIntersectObjects[0].object;

                // 🟢 Traverse vers le haut pour trouver le userData avec .parentInstance
                let current = hit;
                while (current && !current.userData.parentInstance) {
                    current = current.parent;
                }

                // Une fois l'objet parent trouvé, on peut jouer l'animation
                if (current && current.userData.parentInstance) {
                    this.newAnimatedObjectLeft = current.userData.parentInstance;                       

                    if(this.currentIntersectLeft == null)
                    {
                        
                        if(this.experience.renderer.enablePostProcessing)
                        {
                            // console.log(animatedObject.model);
                            this.experience.renderer.addSelectedObject(this.newAnimatedObjectLeft.model)
                        }
                    }

                    if(!this.newAnimatedObjectLeft.loopFalse){
                        console.log("loopTrue");
                        
                        // Si l'animation n'est pas déjà en cours, la lancer
                        if (!this.newAnimatedObjectLeft.isPlaying) {
                            this.newAnimatedObjectLeft.playAnimation();
                        }
                    }
                    else{
                        console.log("loopFalse");
                        if(this.currentIntersectLeft == null)
                        {
                            if (!this.newAnimatedObjectLeft.isPlaying) {
                                this.newAnimatedObjectLeft.playAnimation();
                            }
                        }
                    }

                    this.currentIntersectLeft = this.newAnimatedObjectLeft            
                }
                
            }
            else
            {
                if(this.currentIntersectLeft)
                {
                    this.experience.renderer.removeSelectedObject()
                }

                this.currentIntersectLeft = null
            }
        }
        else
        {
            this.getCursorForRaycast("right")
            this.instance.setFromCamera(new THREE.Vector2(this.x, this.y), this.experience.camera.instance)
            this.objectsIntersectRight.resultIntersectObjects = this.instance.intersectObjects(this.objectsIntersectRight.objects)

            // console.log(this.objectsIntersectRight.resultIntersectObjects);

            if(this.objectsIntersectRight.resultIntersectObjects.length > 0)
            {
                const hit = this.objectsIntersectRight.resultIntersectObjects[0].object;

                // 🟢 Traverse vers le haut pour trouver le userData avec .parentInstance
                let current = hit;
                while (current && !current.userData.parentInstance) {
                    current = current.parent;
                }

                // Une fois l'objet parent trouvé, on peut jouer l'animation
                if (current && current.userData.parentInstance) {
                    this.newAnimatedObjectRight = current.userData.parentInstance;

                    if(this.currentIntersectRight == null)
                    {
                        if(this.experience.renderer.enablePostProcessing)
                        {
                            // console.log(this.newAnimatedObjectRight.model);
                            this.experience.renderer.addSelectedObject(this.newAnimatedObjectRight.model)
                        }
                    }

                    if(!this.newAnimatedObjectRight.loopFalse){
                        // console.log("loopTrue");
                        
                        // Si l'animation n'est pas déjà en cours, la lancer
                        if (!this.newAnimatedObjectRight.isPlaying) {
                            this.newAnimatedObjectRight.playAnimation();
                        }
                    }
                    else{
                        // console.log("loopFalse");
                        if(this.currentIntersectRight == null)
                        {
                            if (!this.newAnimatedObjectRight.isPlaying) {
                                this.newAnimatedObjectRight.playAnimation();
                            }
                        }
                    }

                    this.currentIntersectRight = this.newAnimatedObjectRight
                }
                
            }
            else
            {
                if(this.currentIntersectRight)
                {
                    this.experience.renderer.removeSelectedObject()
                }

                this.currentIntersectRight = null
            }
        }
    }

    update()
    {
        this.frameCount++;

        if (this.frameCount % this.raycastInterval === 0)
        {
            this.sendRaycast()
        }

        // if (this.frameCount % 4 === 0)
        // {
        //     this.sendRaycast()
        // }
    }
}