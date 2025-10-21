import * as THREE from 'three'
import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Input extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();

        const actions = {
            'ArrowRight': () => {
                console.log("open portfolio page")
            },
            'ArrowLeft': () => console.log("open profile page"),
            'KeyR': () => this.experience.world.reyna.playAnimation(),
            'KeyB': () => this.experience.world.breach.playAnimation(),
            'KeyC': () => this.experience.world.chamber.playAnimation(),
            'KeyL': () => this.experience.world.rlTrack.playAnimation(),
            'KeyJ': () => this.experience.world.jordan.playAnimation(),
            'KeyV': () => this.experience.world.ball.playAnimation(),
            'KeyM': () => this.experience.world.mouse.playAnimation(),
            'KeyP': () => this.experience.world.pc.playAnimation(),
            'KeyS': () => this.experience.world.chair.playAnimation(),
            'KeyH': () => this.experience.world.hat.playAnimation()
        };

        document.addEventListener('keydown', (event) => {
            if (actions[event.code]) actions[event.code]();
        });
    }
}
