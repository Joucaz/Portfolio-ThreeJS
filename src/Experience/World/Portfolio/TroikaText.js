import * as THREE from 'three'
import { Text } from 'troika-three-text'
import Experience from '../../Experience.js'

export default class TroikaText
{
    constructor({ parentGroup })
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.world = this.experience.world
        this.debug = this.experience.debug    
        this.parentGroup = parentGroup    
        this.groupText = new THREE.Group()

        this.texts = [] 

        this.textRLMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff 
        })
        this.textRLMaterial.color.setScalar(0.04);

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('TroikaText')
        }
        
        this.setTexts()
    }

    setTexts()
    {
        const textsData = [
            //GOOD POSITION A PLAT :: NE PAS TOUCHER SANS AVOIR REMIS GROUPE A POSITION DE BASE
            { key: 'lapLabel', text: 'LAP', position: [0, 0.36, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.06, fontWeight: 900, letterSpacing: 0, lineHeight: 1 },
            { key: 'lapOctane', text: '0', position: [-0.22, 0.38, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.1, fontWeight: 900, letterSpacing: 0, lineHeight: 1 },
            { key: 'lapFennec', text: '0', position: [0.22, 0.38, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.1, fontWeight: 900, letterSpacing: 0, lineHeight: 1 },
            { key: 'speedLabel', text: 'SPEED', position: [0, 0.16, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.06, fontWeight: 900, letterSpacing: 0, lineHeight: 1 },
            { key: 'speedOctane', text: '110', position: [-0.22, 0.18, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.1, fontWeight: 900, letterSpacing: 0, lineHeight: 1 },
            { key: 'speedFennec', text: '110', position: [0.22, 0.18, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.1, fontWeight: 900, letterSpacing: 0, lineHeight: 1 },
            { key: 'nameFennec', text: 'Fennec', position: [0.22, 0.26, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.06, fontWeight: 500, letterSpacing: 0, lineHeight: 1 },
            { key: 'nameOctane', text: 'Octane', position: [-0.22, 0.26, 0.19], rotationY: 0, color: 0xffffff, fontSize: 0.06, fontWeight: 500, letterSpacing: 0, lineHeight: 1 },
        ]

        textsData.forEach((data, index) => {
            
            const text = new Text()
            text.text = data.text
            // text.font = "../../../../static/fonts/stocky.ttf"
            text.fontSize = data.fontSize
            text.fontWeight = data.fontWeight
            text.letterSpacing = data.letterSpacing
            text.lineHeight = data.lineHeight
            text.textAlign = 'center'
            text.anchorX = 'center'
            text.anchorY = 'center'
            text.position.set(...data.position)
            text.rotation.set(0, data.rotationY, 0)

            // Utiliser le matériau partagé
            text.material = this.textRLMaterial

            this.groupText.add(text)

            text.sync()

            this.texts[data.key] = text

            // Debug GUI
            if(this.debug.active)
            {
                const folder = this.debugFolder.addFolder(`Text ${index+1}: ${data.text}`)
                folder.add(text.position, 'x', -0.8, 0.5, 0.01).name('Position X')
                folder.add(text.position, 'y', 0, 1, 0.01).name('Position Y')
                // folder.add(text.position, 'z', -1, 1, 0.01).name('Position Z')
                // folder.add(text.rotation, 'x', -Math.PI, Math.PI, 0.01).name('Rotation X')
                // folder.add(text.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Rotation Y')
                // folder.add(text.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Rotation Z')
                folder.addColor({ color: data.color }, 'color').name('Color').onChange(c => {
                    text.color = c
                    this.sharedMaterial.color.set(c) // couleur partagée
                    text.sync()
                })
                folder.add(text, 'fontSize', 0,0.2, 0.01).name('Font Size').onChange(() => text.sync())
                folder.add(text, 'fontWeight', 100, 900, 100).name('Font Weight').onChange(() => text.sync())
                folder.add(text, 'letterSpacing', -0.1, 0.1, 0.001).name('Letter Spacing').onChange(() => text.sync())
                folder.add(text, 'lineHeight', 0.5, 2, 0.01).name('Line Height').onChange(() => text.sync())
            }
        })

        this.parentGroup.add(this.groupText)

        this.groupText.position.set(0.035, -0.91, -0.059)
        this.groupText.rotation.y = -0.09

        if(this.debug.active)
        {
            const groupFolder = this.debugFolder.addFolder('Parent Group')
            groupFolder.add(this.groupText.position, 'x', -0.5, 0.5, 0.001).name('Position X')
            groupFolder.add(this.groupText.position, 'y', -1.25, -0.8, 0.01).name('Position Y')
            groupFolder.add(this.groupText.position, 'z', -0.2, 0.2, 0.001).name('Position Z')

            // groupFolder.add(this.groupText.rotation, 'x', -Math.PI, Math.PI, 0.01).name('Rotation X')
            groupFolder.add(this.groupText.rotation, 'y', -0.1, -0.06, 0.001).name('Rotation Y')
            // groupFolder.add(this.groupText.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Rotation Z')

            // groupFolder.add(this.groupText.scale, 'x', 0.1, 5, 0.01).name('Scale X')
            // groupFolder.add(this.groupText.scale, 'y', 0.1, 5, 0.01).name('Scale Y')
            // groupFolder.add(this.groupText.scale, 'z', 0.1, 5, 0.01).name('Scale Z')
        }
    }

    updateText(key, newText) {
        if (!this.texts[key]) return
        this.texts[key].text = newText
        this.texts[key].sync()
    }

}
