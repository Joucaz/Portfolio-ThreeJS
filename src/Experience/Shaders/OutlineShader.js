import * as THREE from 'three'

export default class OutlineShader {
  constructor({ color = 0x000000, thickness = 0.05, screenspace = false, opacity = 1 } = {}) {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
        thickness: { value: thickness },
        screenspace: { value: screenspace },
        opacity: { value: opacity },
        size: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        uniform float thickness;
        uniform bool screenspace;
        uniform vec2 size;
        void main() {
          vec4 tNormal = vec4(normal, 0.0);
          vec4 tPosition = vec4(position, 1.0);
          if (screenspace) {
            vec3 newPosition = tPosition.xyz + tNormal.xyz * thickness;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0); 
          } else {
            vec4 clipPosition = projectionMatrix * modelViewMatrix * tPosition;
            vec4 clipNormal = projectionMatrix * modelViewMatrix * tNormal;
            vec2 offset = normalize(clipNormal.xy) * thickness / size * clipPosition.w * 2.0;
            clipPosition.xy += offset;
            gl_Position = clipPosition;
          }
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        void main() {
          gl_FragColor = vec4(color, opacity);
        }
      `,
      side: THREE.BackSide,
      transparent: opacity < 1
    })
  }

  applyTo(mesh) {
    // Clone mesh (profond) et applique le shader
    const outlineMesh = mesh.clone(true)
    outlineMesh.traverse(child => {
      if (child.isMesh) {
        child.material = this.material
      }
    })
    outlineMesh.visible = true
    if (mesh.parent) mesh.parent.add(outlineMesh)
    return outlineMesh
  }
}
