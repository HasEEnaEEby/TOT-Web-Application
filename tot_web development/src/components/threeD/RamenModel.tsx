// RamenModel.tsx
import { Float } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface RamenProps {
  position: [number, number, number];
  isHovered?: boolean;
  scale?: number;
}

interface GLTFResult extends GLTF {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
}

export function RamenModel({ position, isHovered = false, scale = 1 }: RamenProps) {
  const gltf = useLoader(GLTFLoader, '/model/ramen.glb') as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Slow continuous rotation
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.4}
      floatIntensity={0.5}
    >
      <group
        ref={groupRef}
        position={position}
        scale={scale}
      >
        <primitive 
          object={gltf.scene}
          rotation={[0, Math.PI / 4, 0]}
        />
      </group>
    </Float>
  );
}