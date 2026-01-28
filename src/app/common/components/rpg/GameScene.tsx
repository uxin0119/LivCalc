import { Player } from './Player';
import { Ground, Tree, Rock } from './WorldObjects';
import { OrbitControls } from '@react-three/drei';

export const GameScene = () => {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />

      {/* Game Objects */}
      <Player />
      <Ground />

      {/* Environment Props */}
      <Tree position={[-3, 0, -3]} />
      <Tree position={[5, 0, 2]} />
      <Tree position={[-5, 0, 4]} />
      <Tree position={[2, 0, -6]} />
      <Tree position={[8, 0, -2]} />
      
      <Rock position={[2, 0.25, 3]} />
      <Rock position={[-2, 0.4, 6]} scale={1.5} />
      <Rock position={[6, 0.25, -5]} />

      {/* Optional: Orbit controls for debugging, though Player handles camera */}
      {/* <OrbitControls /> */} 
    </>
  );
};
