import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import { FontLoader } from 'three/addons/loaders/FontLoader.js'

import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoadingManager()
        this.setLoaders()
        this.startLoading()
    }

    setLoadingManager() {
        const loaderElement = document.getElementById('loader');
        const loaderBar = document.querySelector('.loader-bar-fill');
        const loaderPercent = document.getElementById('loader-percent');
        const glassCard = document.querySelector('.glass-card');
        const enterBtn = glassCard.querySelector('.enter-btn');
        const infoBtn = glassCard.querySelector('.info-btn');
        const cardFull = glassCard.querySelector('.card-full');

        glassCard.addEventListener('mouseenter', () => {

            cardFull.classList.add('show');
            infoBtn.classList.add('hide'); 
        });

        glassCard.addEventListener('mouseleave', () => {

            cardFull.classList.remove('show');
            infoBtn.classList.remove('hide');

        });

        this.loadingManager = new THREE.LoadingManager(
            // Quand tout est chargé
            // () => {
            //     loaderElement.style.opacity = '0';
            //     setTimeout(() => loaderElement.remove(), 600);
            // },
            () => {
                setTimeout(() => {
                    loaderElement.style.opacity = '0';

                    glassCard.style.opacity = '1';
                }, 500);
                
            },

            // Pendant le chargement
            (url, itemsLoaded, itemsTotal) => {
                const progress = itemsLoaded / itemsTotal;

                loaderBar.style.transform = `scaleX(${progress})`;
                
                // loaderPercent.textContent = `${Math.floor(progress * 100)}%`;
                loaderPercent.textContent = `${(progress * 100).toFixed(2)} %`;
            }
        );

        // // Clic sur Enter → tout disparaît
        // enterBtn.addEventListener('click', () => {
        //     // Masquer le loader
        //     loaderElement.style.opacity = '0';
        //     setTimeout(() => loaderElement.style.display = 'none', 600);
            
        //     glassCard.style.opacity = '0';
        //     setTimeout(() => glassCard.style.display = 'none', 400);
        // });

        // enterBtn.addEventListener('click', () => {
        //     // Masquer le loader
        //     loaderElement.style.opacity = '0';
        //     setTimeout(() => loaderElement.style.display = 'none', 600);

        //     cardFull.style.display = 'none';
        //     infoBtn.style.display = 'block';
        // });

        // Quand on clique sur le bouton "I" → tout réapparaît
        infoBtn.addEventListener('click', () => {
            cardFull.style.display = 'block';
            infoBtn.style.display = 'none';
        });

        

    }


    setLoaders()
    {
        
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        // this.loaders.fontLoader = new FontLoader(this.loadingManager)
        // this.loaders.fontLoader = new THREE.FileLoader(this.loadingManager)
        // this.loaders.fontLoader.setResponseType('arraybuffer') // important pour TTF
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        // this.dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
        this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            // else if(source.type === 'font')
            // {
            //     this.loaders.fontLoader.load(
            //         source.path,
            //         (file) =>
            //         {
            //             // file est un ArrayBuffer
            //             console.log(file);
                        
            //             this.sourceLoaded(source, file)
            //         }
            //     )
            // }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')                
        }
    }
}