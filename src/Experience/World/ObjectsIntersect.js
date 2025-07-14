import * as THREE from 'three'
import Experience from '../Experience'

export default class ObjectsIntersect
{
    constructor()
    {
        this.experience = new Experience()
        this.objects = []
        this.resultIntersectObjects = []

        // console.log("hello")
    }

    addObject(object)
    {
        this.objects.push(object)
        // console.log("Object ", object, "was added to ", this.objects);
    }


}