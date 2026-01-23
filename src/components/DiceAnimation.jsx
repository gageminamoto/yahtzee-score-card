import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Dice3D from './Dice3D';

// Single falling die with physics
function FallingDie({ startPos, delay }) {
  const meshRef = useRef();
  const [started, setStarted] = useState(false);
  const [landed, setLanded] = useState(false);
  
  // Physics state
  const velocityY = useRef(0); // Gravity (downward)
  const velocityZ = useRef(0.05 + Math.random() * 0.05); // Forward motion
  
  const rotationSpeed = useRef([
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2
  ]);
  
  // Random initial rotation
  const initialRotation = useMemo(() => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ], []);

  useFrame((state, delta) => {
    // Simple delay mechanism
    if (!started) {
      setTimeout(() => setStarted(true), delay);
      return;
    }

    if (meshRef.current && !landed) {
      // Check for screen plane collision (z >= 0)
      if (meshRef.current.position.z >= 0) {
        setLanded(true);
        // Snap to screen plane
        meshRef.current.position.z = 0;
        return;
      }

      // Apply gravity (Y-axis down)
      velocityY.current += 0.01;
      meshRef.current.position.y -= velocityY.current;
      
      // Apply forward motion (Z-axis toward camera)
      meshRef.current.position.z += velocityZ.current;
      
      // Rotate on all axes
      meshRef.current.rotation.x += rotationSpeed.current[0];
      meshRef.current.rotation.y += rotationSpeed.current[1];
      meshRef.current.rotation.z += rotationSpeed.current[2];
    }
  });

  // Hide until started to avoid popping in
  return (
    <group ref={meshRef} position={startPos} rotation={initialRotation} visible={started}>
      <Dice3D />
    </group>
  );
}

function Scene({ count = 5, fromTop = false }) {
  const { viewport } = useThree();
  
  // Generate random dice configurations
  const dice = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      // Random X within viewport width (with some padding)
      x: (Math.random() - 0.5) * viewport.width * 0.8,
      // Start position (3D space)
      // Y: If fromTop, start at top of viewport (above visible area); otherwise above camera (3-5 units)
      y: fromTop ? viewport.height / 2 + 3 + Math.random() * 1 : 3 + Math.random() * 2,
      // Z: Behind camera (-5 to -10 units)
      z: -5 - Math.random() * 5,
      // Random start delay for natural feel
      delay: Math.random() * 500
    }));
  }, [viewport.width, viewport.height, count, fromTop]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {dice.map((die) => (
        <FallingDie 
          key={die.id} 
          startPos={[die.x, die.y, die.z]} 
          delay={die.delay} 
        />
      ))}
    </>
  );
}

/**
 * DiceAnimation component
 * @param {boolean} fromTop - If true, dice start from the top of the screen
 */
export default function DiceAnimation({ fromTop = false }) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-popover dice-animation-overlay"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]} // Support high DPI screens
        gl={{ alpha: true, antialias: true }} // Transparent background
        style={{ pointerEvents: 'none' }}
      >
        <Scene fromTop={fromTop} />
      </Canvas>
    </div>
  );
}
