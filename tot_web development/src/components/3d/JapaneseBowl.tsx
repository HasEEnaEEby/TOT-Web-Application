import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

interface Props {
  position?: [number, number, number];
  isHovered?: boolean; // Added isHovered here
}

export function JapaneseBowl({ position = [0, 0, 0], isHovered = false }: Props) {
  const bowlRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (bowlRef.current) {
      bowlRef.current.rotation.y += 0.005;
      bowlRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Example of using isHovered to change scale
      if (isHovered) {
        bowlRef.current.scale.set(1.1, 1.1, 1.1); // Scale up when hovered
      } else {
        bowlRef.current.scale.set(1, 1, 1); // Reset scale when not hovered
      }
    }
  });

  return (
    <mesh ref={bowlRef} position={position}>
      <cylinderGeometry args={[1, 0.8, 0.8, 32]} />
      <meshStandardMaterial 
        color="#d32f2f"
        metalness={0.2}
        roughness={0.8}
      />
      {/* Rice */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
    </mesh>
  );
}
