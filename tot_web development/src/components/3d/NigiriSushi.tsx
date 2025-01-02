import { useRef } from 'react';
import { Mesh, Group } from 'three';
import { useSushiAnimation } from '../../hooks/use-sushi-animation';

interface Props {
  position?: [number, number, number];
  isHovered?: boolean;
  type?: 'salmon' | 'tuna' | 'shrimp';
}

const FISH_COLORS = {
  salmon: '#ff8c69',
  tuna: '#b91c1c',
  shrimp: '#ffc0cb',
};

export function NigiriSushi({ position = [0, 0, 0], isHovered = false, type = 'salmon' }: Props) {
  const sushiRef = useRef<Group>(null); // Use Group reference here instead of Mesh
  useSushiAnimation(sushiRef, position, isHovered); // Updated to match Group reference

  return (
    <group ref={sushiRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
        <meshStandardMaterial color="#fff" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
        <meshStandardMaterial 
          color={FISH_COLORS[type]} 
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[1.02, 0.2, 1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
    </group>
  );
}
