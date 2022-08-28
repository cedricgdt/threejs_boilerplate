import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'


export default class Sketch {
    constructor() {

        this.canvas = document.querySelector('canvas.webgl')
        this.sizes = { width: window.innerWidth, height: window.innerHeight }
        this.time = 0

        this.init()
        this.addObject()
        this.render()
    }

    init() {
        this.gui = new dat.GUI()
        this.scene = new THREE.Scene()
        this.textureLoader = new THREE.TextureLoader()

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0.25, - 0.25, 1)
        this.scene.add(this.camera)        

        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
        
        window.addEventListener('resize', () => {
            this.resize()
        })

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvas
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    addObject() {
        // Geometry
        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

        // Material
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                progress: { type: "f", value: 0 },
            },
            side: THREE.DoubleSide,
        })

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    resize() {

        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    render() {
        this.time++

       // Update controls
        this.controls.update()
    
        // Render
        this.renderer.render(this.scene, this.camera)

        window.requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch()