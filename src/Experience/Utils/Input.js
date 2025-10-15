import * as THREE from 'three'
import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Input extends EventEmitter
{
    constructor()
    {
        this.experience = new Experience()

        document.addEventListener('keydown', (event) => {
            console.log(event.code);
            
            // switch (event.code) {
            //     case 'KeyC':
            //         this.trigger('cInputDown');
            //         break;
            //     case 'KeyV':
            //         this.trigger('vInputDown');
            //         break;
            //     case 'ArrowUp':
            //         this.trigger('upInputDown');
            //         break;
            // }
        });
    }

}