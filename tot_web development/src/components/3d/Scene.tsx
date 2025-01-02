import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { JapaneseBowl } from './JapaneseBowl';
import { Chopsticks } from './Chopsticks';
import { SushiPlate } from './SushiPlate';
import { TeaPot } from './teaPot';
import { Mochi } from './Mochi';


export function Scene() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="h-[400px] w-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 3, 7]} />
        <OrbitControls 
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[0, 5, 0]}
          intensity={0.5}
          angle={0.5}
          penumbra={1}
        />

        <group position={[0, -1, 0]}>
          {/* Main dishes */}
          <group
            onPointerOver={() => setHoveredItem('bowl')}
            onPointerOut={() => setHoveredItem(null)}
          >
            <JapaneseBowl 
              position={[-2, 0, 0]} 
              isHovered={hoveredItem === 'bowl'}
            />
          </group>

          <group
            onPointerOver={() => setHoveredItem('chopsticks')}
            onPointerOut={() => setHoveredItem(null)}
          >
            <Chopsticks 
              position={[-0.5, 0, 0]}
              isHovered={hoveredItem === 'chopsticks'}
            />
          </group>

          <group
            onPointerOver={() => setHoveredItem('sushi')}
            onPointerOut={() => setHoveredItem(null)}
          >
            <SushiPlate 
              position={[1, 0, 0]}
              isHovered={hoveredItem === 'sushi'}
            />
          </group>

          {/* New items */}
          <group
            onPointerOver={() => setHoveredItem('teapot')}
            onPointerOut={() => setHoveredItem(null)}
          >
            <TeaPot 
              position={[2.5, 0.5, -1]}
              isHovered={hoveredItem === 'teapot'}
            />
          </group>

          {/* Mochi desserts */}
          <group position={[0, 0, 1]}>
            <group
              onPointerOver={() => setHoveredItem('mochi1')}
              onPointerOut={() => setHoveredItem(null)}
            >
              <Mochi 
                position={[-0.7, 0.3, 0]} 
                color="#f8bbd0"
                isHovered={hoveredItem === 'mochi1'}
              />
            </group>
            <group
              onPointerOver={() => setHoveredItem('mochi2')}
              onPointerOut={() => setHoveredItem(null)}
            >
              <Mochi 
                position={[0, 0.3, 0]} 
                color="#a5d6a7"
                isHovered={hoveredItem === 'mochi2'}
              />
            </group>
            <group
              onPointerOver={() => setHoveredItem('mochi3')}
              onPointerOut={() => setHoveredItem(null)}
            >
              <Mochi 
                position={[0.7, 0.3, 0]} 
                color="#ffcc80"
                isHovered={hoveredItem === 'mochi3'}
              />
            </group>
          </group>
        </group>
      </Canvas>
    </div>
  );
}