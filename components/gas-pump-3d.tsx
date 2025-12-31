'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default function GasPump3D() {
  const mountRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )
    camera.position.set(0, 1, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    mountRef.current.appendChild(renderer.domElement)

    // Post-processing with bloom
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  // strength
      0.4,  // radius
      0.85  // threshold
    )
    composer.addPass(bloomPass)

    // Synthwave colors
    const hotPink = new THREE.Color(0xff2d95)
    const cyan = new THREE.Color(0x00f5d4)
    const purple = new THREE.Color(0xb14aed)
    const orange = new THREE.Color(0xff6b35)

    // Main pump group
    const pumpGroup = new THREE.Group()

    // Base platform with neon edge
    const baseGeo = new THREE.BoxGeometry(2.5, 0.2, 1.5)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.2,
    })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.y = -2
    pumpGroup.add(base)

    // Neon base edge
    const baseEdgeGeo = new THREE.BoxGeometry(2.6, 0.05, 1.6)
    const baseEdgeMat = new THREE.MeshBasicMaterial({ color: cyan })
    const baseEdge = new THREE.Mesh(baseEdgeGeo, baseEdgeMat)
    baseEdge.position.y = -1.85
    pumpGroup.add(baseEdge)

    // Main body - chrome with dark tint
    const bodyGeo = new THREE.BoxGeometry(1.8, 3.5, 1)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.95,
      roughness: 0.1,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = -0.15
    pumpGroup.add(body)

    // Neon trim lines on body
    const createNeonLine = (width: number, height: number, depth: number, color: THREE.Color, position: THREE.Vector3) => {
      const geo = new THREE.BoxGeometry(width, height, depth)
      const mat = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(position)
      return mesh
    }

    // Vertical neon lines
    pumpGroup.add(createNeonLine(0.03, 3.4, 0.03, hotPink, new THREE.Vector3(-0.85, -0.15, 0.52)))
    pumpGroup.add(createNeonLine(0.03, 3.4, 0.03, hotPink, new THREE.Vector3(0.85, -0.15, 0.52)))
    
    // Horizontal neon lines
    pumpGroup.add(createNeonLine(1.7, 0.03, 0.03, cyan, new THREE.Vector3(0, 1.5, 0.52)))
    pumpGroup.add(createNeonLine(1.7, 0.03, 0.03, cyan, new THREE.Vector3(0, -1.8, 0.52)))

    // Display screen area
    const screenGeo = new THREE.BoxGeometry(1.4, 0.9, 0.1)
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, 0.8, 0.56)
    pumpGroup.add(screen)

    // Screen border (glowing)
    const screenBorderGeo = new THREE.BoxGeometry(1.5, 1.0, 0.08)
    const screenBorderMat = new THREE.MeshBasicMaterial({ color: purple })
    const screenBorder = new THREE.Mesh(screenBorderGeo, screenBorderMat)
    screenBorder.position.set(0, 0.8, 0.52)
    pumpGroup.add(screenBorder)

    // Animated screen content - "USDC" text simulation with glowing bars
    const createGlowBar = (width: number, y: number, color: THREE.Color) => {
      const geo = new THREE.BoxGeometry(width, 0.08, 0.02)
      const mat = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, 0.8 + y, 0.62)
      return mesh
    }
    
    const bar1 = createGlowBar(0.8, 0.25, cyan)
    const bar2 = createGlowBar(0.5, 0.1, hotPink)
    const bar3 = createGlowBar(0.9, -0.05, cyan)
    const bar4 = createGlowBar(0.4, -0.2, hotPink)
    pumpGroup.add(bar1, bar2, bar3, bar4)

    // Price display
    const priceGeo = new THREE.BoxGeometry(0.6, 0.15, 0.02)
    const priceMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const price = new THREE.Mesh(priceGeo, priceMat)
    price.position.set(0, 0.5, 0.62)
    pumpGroup.add(price)

    // Fuel nozzle holder
    const holderGeo = new THREE.BoxGeometry(0.4, 0.6, 0.3)
    const holderMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.3,
    })
    const holder = new THREE.Mesh(holderGeo, holderMat)
    holder.position.set(0.7, -0.3, 0.65)
    pumpGroup.add(holder)

    // Nozzle
    const nozzleGroup = new THREE.Group()
    
    // Nozzle handle
    const handleGeo = new THREE.BoxGeometry(0.15, 0.4, 0.2)
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.7,
      roughness: 0.3,
    })
    const handle = new THREE.Mesh(handleGeo, handleMat)
    nozzleGroup.add(handle)

    // Nozzle spout
    const spoutGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.5, 16)
    const spoutMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.1,
    })
    const spout = new THREE.Mesh(spoutGeo, spoutMat)
    spout.rotation.z = Math.PI / 2
    spout.position.x = 0.3
    nozzleGroup.add(spout)

    // Neon ring on nozzle
    const ringGeo = new THREE.TorusGeometry(0.08, 0.015, 8, 32)
    const ringMat = new THREE.MeshBasicMaterial({ color: hotPink })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.y = Math.PI / 2
    ring.position.x = 0.1
    nozzleGroup.add(ring)

    nozzleGroup.position.set(0.7, -0.3, 0.9)
    pumpGroup.add(nozzleGroup)

    // Flexible hose
    const hosePoints = [
      new THREE.Vector3(0.7, -0.5, 0.8),
      new THREE.Vector3(1.2, -0.8, 1.2),
      new THREE.Vector3(1.5, -1.2, 1.0),
      new THREE.Vector3(1.8, -1.5, 0.6),
    ]
    const hoseCurve = new THREE.CatmullRomCurve3(hosePoints)
    const hoseGeo = new THREE.TubeGeometry(hoseCurve, 32, 0.06, 12, false)
    const hoseMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.5,
      roughness: 0.6,
    })
    const hose = new THREE.Mesh(hoseGeo, hoseMat)
    pumpGroup.add(hose)

    // Top sign - "GAS" with neon glow
    const signGeo = new THREE.BoxGeometry(1.6, 0.5, 0.1)
    const signMat = new THREE.MeshBasicMaterial({ color: hotPink })
    const sign = new THREE.Mesh(signGeo, signMat)
    sign.position.set(0, 2.1, 0.56)
    pumpGroup.add(sign)

    // Sign backing
    const signBackGeo = new THREE.BoxGeometry(1.7, 0.6, 0.15)
    const signBackMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.9,
      roughness: 0.1,
    })
    const signBack = new THREE.Mesh(signBackGeo, signBackMat)
    signBack.position.set(0, 2.1, 0.5)
    pumpGroup.add(signBack)

    // Add pump to scene
    pumpGroup.position.y = 0.5
    scene.add(pumpGroup)

    // Ground grid (synthwave floor effect)
    const gridHelper = new THREE.GridHelper(20, 40, hotPink, purple)
    gridHelper.position.y = -1.5
    gridHelper.material.opacity = 0.3
    gridHelper.material.transparent = true
    scene.add(gridHelper)

    // Lighting setup for synthwave feel
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5)
    scene.add(ambientLight)

    // Main pink light from front-left
    const pinkLight = new THREE.PointLight(hotPink, 2, 15)
    pinkLight.position.set(-3, 3, 4)
    scene.add(pinkLight)

    // Cyan light from front-right
    const cyanLight = new THREE.PointLight(cyan, 2, 15)
    cyanLight.position.set(3, 2, 4)
    scene.add(cyanLight)

    // Purple backlight
    const purpleLight = new THREE.PointLight(purple, 1.5, 12)
    purpleLight.position.set(0, 4, -3)
    scene.add(purpleLight)

    // Subtle orange accent from below
    const orangeLight = new THREE.PointLight(orange, 0.8, 8)
    orangeLight.position.set(0, -2, 2)
    scene.add(orangeLight)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Gentle rotation
      pumpGroup.rotation.y = Math.sin(time * 0.5) * 0.3

      // Bobbing motion
      pumpGroup.position.y = 0.5 + Math.sin(time) * 0.05

      // Animate screen bars
      bar1.scale.x = 0.8 + Math.sin(time * 2) * 0.2
      bar2.scale.x = 0.8 + Math.sin(time * 2 + 1) * 0.2
      bar3.scale.x = 0.8 + Math.sin(time * 2 + 2) * 0.2
      bar4.scale.x = 0.8 + Math.sin(time * 2 + 3) * 0.2

      // Animate nozzle ring glow
      ring.rotation.x = time * 2

      // Pulse the sign
      const signPulse = 1 + Math.sin(time * 3) * 0.1
      sign.scale.set(signPulse, signPulse, 1)

      // Light dance
      pinkLight.intensity = 2 + Math.sin(time * 2) * 0.5
      cyanLight.intensity = 2 + Math.sin(time * 2 + Math.PI) * 0.5

      // Grid scroll effect
      gridHelper.position.z = (time * 0.5) % 0.5

      composer.render()
    }
    animate()

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      
      renderer.setSize(width, height)
      composer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      composer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #0d0221 0%, #1a0a2e 50%, #0f1b2e 100%)' }}
    />
  )
}