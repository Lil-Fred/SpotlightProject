import { Vector3 } from 'three'
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, SpotLight, useDepthBuffer } from '@react-three/drei'

// all these gltf comments are in regards to a spotlight that i haven't been able to load yet
// import { Suspense } from 'react'
// import { useLoader } from '@react-three/fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function App() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [-1, 2, 6], fov: 50, near: 1, far: 20 }}>
      {/* <color attach="background" args={['radical-gradient(farthest-side at 60% 55%, blue, green, yellow, black)']} /> */}
      <fog attach="fog" args={['#202020', 5, 20]} />
      <ambientLight intensity={0.02} />
      <Scene />
    </Canvas>
  )
}

function Scene() {
  // This is a super cheap depth buffer that only renders once (frames: 1 is optional!), which works well for static scenes
  // Spots can optionally use that for realism, learn about soft particles here: http://john-chapman-graphics.blogspot.com/2013/01/good-enough-volumetrics-for-spotlights.html
  const depthBuffer = useDepthBuffer({ frames: 1 })

  // const { nodes, materials } = useGLTF('scene.gltf')
  // const gltf = useLoader(GLTFLoader, 'scene.gltf')
  return (
    <>
      {/* <Suspense fallback={null}>
        <primitive object={gltf.scene} />
      </Suspense> */}
      <MovingSpot depthBuffer={depthBuffer} color="#e6e6e6" position={[3, 2.8, 0]} />
      {/* <MovingSpot depthBuffer={depthBuffer} color="#0096FF" position={[1, 3, 0]} /> */}
      {/* <mesh position={[0, -1.03, 0]} castShadow receiveShadow geometry={nodes.RootNode.geometry} material={materials['Default OBJ.001']} dispose={null} /> */}
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        {/* <planeGeometry args={[10, 10]} />
        <meshStandardMaterial attach="color" args={['#00ff00', 0.5]} /> */}
      </mesh>
    </>
  )
}

function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)
  useFrame((state) => {
    light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
    light.current.target.updateMatrixWorld()
  })
  return <SpotLight castShadow ref={light} penumbra={1} distance={6} angle={0.25} attenuation={6} anglePower={4} intensity={2} {...props} />
}
