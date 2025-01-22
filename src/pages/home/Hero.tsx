import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "../../components/common/button";
import { RamenModel } from "../../components/threeD/RamenModel";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up opacity-0">
            <div className="p-2 bg-primary/10 rounded-full">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              いらっしゃいませ • Welcome
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in-up opacity-0 stagger-1">
            Order Food with 
            <span className="text-primary"> Peace of Mind</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up opacity-0 stagger-2">
            Experience hassle-free food ordering designed for introverts. 
            No phone calls, no social anxiety - just delicious food delivered to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 stagger-3">
            <Button size="lg" className="text-lg">
              Start Ordering
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              View Restaurants
            </Button>
          </div>
        </div>

        <div className="relative h-[500px] w-[800px]">
          <Canvas
            className="bg-transparent"
            camera={{ 
              position: [3, 5, 5],
              fov: 55,
              near: 0.1,
              far: 1000
            }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
            />
            <spotLight
              position={[-5, 5, 0]}
              intensity={0.5}
              angle={0.4}
              penumbra={1}
              castShadow
            />

            <Environment preset="sunset" />

            <RamenModel 
              position={[0, -7.5, 0]}
              scale={1.12}
            />

            <OrbitControls
              enableZoom={true}
              minDistance={3}
              maxDistance={10}
              enableDamping={true}
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              enablePan={false}
              target={[0, -1, 0]}
            />

            <fog attach="fog" args={['#f8f9fa', 8, 20]} />
          </Canvas>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}