import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Props {
  position?: [number, number, number];
  color?: string;
  isHovered?: boolean; // Added isHovered here
}

export function Mochi({ position = [0, 0, 0], color = "#f8bbd0", isHovered = false }: Props) {
  const mochiRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (mochiRef.current) {
      // Bouncy animation when hovered
      if (isHovered) {
        mochiRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
        mochiRef.current.scale.x = 1 - Math.sin(state.clock.elapsedTime * 8) * 0.05;
      } else {
        mochiRef.current.scale.setScalar(1); // Reset scale when not hovered
      }
    }
  });

  return (
    <mesh ref={mochiRef} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        metalness={0}
        roughness={0.3}
      />
      {/* Powdered sugar effect */}
      <mesh position={[0, 0.15, 0]} scale={[0.9, 0.2, 0.9]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
    </mesh>
  );
}
