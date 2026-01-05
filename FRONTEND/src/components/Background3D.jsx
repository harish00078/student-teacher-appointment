import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere({ position, color, speed }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 32, 32]} position={position} ref={meshRef}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#0f172a' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <AnimatedSphere position={[-5, 2, -5]} color="#6366f1" speed={0.5} />
        <AnimatedSphere position={[5, -2, -5]} color="#ec4899" speed={0.7} />
        <AnimatedSphere position={[0, 0, -10]} color="#8b5cf6" speed={0.3} />
      </Canvas>
    </div>
  );
}
