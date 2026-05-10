'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeContext } from '@/components/ThemeProvider';

function WireframeShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.08;
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.6, 1]} />
      <meshBasicMaterial color="#67478A" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

function FloatingHexagons() {
  const groupRef = useRef<THREE.Group>(null);
  const positions: [number, number, number][] = [
    [-5, 2, -4],
    [4, -2.5, -3],
    [-3, -3, -5],
    [5, 1.5, -6],
    [-4, -0.5, -5],
    [2, 3, -3],
  ];

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.5 + i * 0.08, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#67478A' : '#87FF5F'}
            wireframe
            transparent
            opacity={0.08 + i * 0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#87FF5F" transparent opacity={0.4} />
    </points>
  );
}

export function ThreeBackground() {
  const { theme } = useThemeContext();
  const bgColor = theme === 'nerv' ? '#201430' : '#F5F0E6';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: bgColor }}
      >
        <WireframeShape />
        <FloatingHexagons />
        <Particles />
      </Canvas>
    </div>
  );
}
