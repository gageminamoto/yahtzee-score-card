import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';

/**
 * 3D Dice component
 * Renders a white rounded cube with black pips
 */
export default function Dice3D({ position, rotation, value = 6 }) {
  // Pip positions for each face (normalized -0.5 to 0.5)
  // Face 1: Front (z+)
  // Face 2: Back (z-)
  // Face 3: Top (y+)
  // Face 4: Bottom (y-)
  // Face 5: Right (x+)
  // Face 6: Left (x-)
  
  // Pip configurations (standard dice layout)
  // 1: Center
  // 2: Top-left, Bottom-right
  // 3: Top-left, Center, Bottom-right
  // 4: Corners
  // 5: Corners + Center
  // 6: Rows of 3
  
  const pipSize = 0.1;
  const pipOffset = 0.51; // Just slightly outside the box
  const boxSize = 1;
  
  // Helper to render a pip
  const Pip = ({ pos }) => (
    <mesh position={pos}>
      <sphereGeometry args={[pipSize, 16, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );

  // Define pip positions for each number (1-6) on specific faces
  // We'll hardcode the "standard" dice layout relative to local space
  // For falling dice, we just need *a* face to show the value, but since they spin,
  // it's better to model all faces correctly.
  
  // Coordinates relative to center (0,0,0) with box size 1 (-0.5 to 0.5)
  const d = 0.25; // spacing
  
  const faces = useMemo(() => {
    return [
      // Face 1 (Front, z+)
      <group key="f1" rotation={[0, 0, 0]}>
        <Pip pos={[0, 0, pipOffset]} />
      </group>,
      
      // Face 6 (Back, z-)
      <group key="f6" rotation={[0, Math.PI, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, d, pipOffset]} />
        <Pip pos={[-d, 0, pipOffset]} />
        <Pip pos={[d, 0, pipOffset]} />
        <Pip pos={[-d, -d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      
      // Face 2 (Top, y+)
      <group key="f2" rotation={[-Math.PI/2, 0, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      
      // Face 5 (Bottom, y-)
      <group key="f5" rotation={[Math.PI/2, 0, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, d, pipOffset]} />
        <Pip pos={[0, 0, pipOffset]} />
        <Pip pos={[-d, -d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      
      // Face 3 (Right, x+)
      <group key="f3" rotation={[0, Math.PI/2, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[0, 0, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      
      // Face 4 (Left, x-)
      <group key="f4" rotation={[0, -Math.PI/2, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, d, pipOffset]} />
        <Pip pos={[-d, -d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>
    ];
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[boxSize, boxSize, boxSize]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="white" roughness={0.5} />
      </RoundedBox>
      {faces}
    </group>
  );
}
