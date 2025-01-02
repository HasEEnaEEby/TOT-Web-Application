import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface Props {
  position?: [number, number, number];
  isHovered?: boolean;
}

export function Chopsticks({ position = [0, 0, 0] }: Props) {
  const sticksRef = useRef<Group>(null); // Use Group type for the group reference
  const stick1Ref = useRef<Mesh>(null); // Use Mesh type for the individual sticks
  const stick2Ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (sticksRef.current) {
      sticksRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (stick1Ref.current && stick2Ref.current) {
      // You can also apply animation on individual sticks if needed
      stick1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.05;
      stick2Ref.current.rotation.x = -Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={sticksRef} position={position}>
      <mesh ref={stick1Ref} position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh ref={stick2Ref} position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
    </group>
  );
}
