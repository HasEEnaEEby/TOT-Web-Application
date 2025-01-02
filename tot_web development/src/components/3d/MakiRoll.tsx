import { useRef } from 'react';
import { Group } from 'three';
import { useSushiAnimation } from '../../hooks/use-sushi-animation';

interface Props {
  position?: [number, number, number];
  isHovered?: boolean;
  filling?: 'cucumber' | 'tuna' | 'avocado';
}

const FILLING_COLORS = {
  cucumber: '#4ade80',
  tuna: '#b91c1c',
  avocado: '#84cc16',
};

export function MakiRoll({ position = [0, 0, 0], isHovered = false, filling = 'cucumber' }: Props) {
  const rollRef = useRef<Group>(null);

  useSushiAnimation(rollRef, position, isHovered);

  return (
    <group ref={rollRef} position={position}>
      {/* Rice layer */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshStandardMaterial color="#fff" roughness={0.8} />
      </mesh>
      
      {/* Filling */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial 
          color={FILLING_COLORS[filling]}
          roughness={0.4}
        />
      </mesh>
      
      {/* Nori wrap */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.4, 16]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
