import { Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface GLTFResult extends GLTF {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
}

function Model() {
  const modelRef = useRef<THREE.Group>();
  const gltf = useLoader(GLTFLoader, "/model/japanese_restaurant.glb") as GLTFResult;

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      modelRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={0.9}
        position={[0, -4, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </Float>
  );
}

export function JapaneseHouseScene() {
  return (
    <div className="h-[600px] relative">
      <Canvas
        className="bg-transparent"
        camera={{ 
          position: [15, 10, 15],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={[15, 10, 15]}
          fov={45}
        />
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          position={[-5, 10, -5]}
          intensity={0.9}
          angle={0.3}
          penumbra={1}
          castShadow
        />
        <Model />
        <OrbitControls
          enableZoom={true}
          minDistance={8}
          maxDistance={25}
          enableDamping={true}
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 2 / 3}
          enablePan={false}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
          target={[0, 3, 0]}
        />
        <fog attach="fog" args={['#f0f0f0', 15, 35]} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-sm text-gray-500 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
        Use mouse wheel to zoom in/out • Drag to rotate
      </div>
    </div>
  );
}