import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  AdaptiveDpr,
  Preload,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function GlassSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.7}>
      {/* outer glass shell */}
      <mesh ref={mesh}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshPhysicalMaterial
          color="#4b8dff"
          roughness={0.08}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.6}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* refractive inner shell */}
      <mesh scale={0.86}>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshPhysicalMaterial
          color="#7fc0ff"
          roughness={0.15}
          metalness={0.4}
          envMapIntensity={2}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>

      {/* lattice */}
      <mesh scale={1.02}>
        <icosahedronGeometry args={[1.35, 3]} />
        <meshBasicMaterial
          color="#5fa8ff"
          wireframe
          transparent
          opacity={0.06}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* luminous core */}
      <mesh scale={0.34}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#2f7bff" toneMapped={false} transparent opacity={0.55} />
      </mesh>
      <mesh scale={0.16}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#bcdcff" toneMapped={false} />
      </mesh>
    </Float>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ring} rotation={tilt}>
      <torusGeometry args={[radius, 0.012, 12, 160]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  );
}

function OrbitDot({
  radius,
  tilt,
  speed,
  offset,
  size,
  color,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  offset: number;
  size: number;
  color: string;
}) {
  const group = useRef<THREE.Group>(null);
  const dot = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (dot.current) {
      dot.current.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
    }
    if (group.current) group.current.rotation.z += 0;
  });
  return (
    <group ref={group} rotation={tilt}>
      <mesh ref={dot}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Particles({ count = 220 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.6;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { positions, geometry };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.035;
    const attr = points.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 4) {
      attr.array[i * 3 + 1] =
        positions[i * 3 + 1] + Math.sin(t * 0.6 + i) * 0.045;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.028}
        color="#9ed4ff"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function Parallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.3 - group.current.rotation.y) * 0.035;
    group.current.rotation.x += (-y * 0.22 - group.current.rotation.x) * 0.035;
    group.current.position.x += (x * 0.22 - group.current.position.x) * 0.045;
    group.current.position.y += (y * 0.16 - group.current.position.y) * 0.045;
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8.6], fov: 38 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 5]} intensity={2.2} color="#8ab6ff" />
      <pointLight position={[-5, -2, 3]} intensity={45} color="#35d7ff" />
      <pointLight position={[3, 4, -4]} intensity={35} color="#2f6bff" />

      <Parallax>
        <group scale={1.18}><GlassSphere /></group>
        <OrbitRing
          radius={2.12}
          tilt={[1.35, 0.2, 0]}
          speed={0.09}
          color="#9ed8ff"
          opacity={0.72}
        />
        <OrbitRing
          radius={2.62}
          tilt={[1.15, -0.45, 0.4]}
          speed={-0.06}
          color="#43dcff"
          opacity={0.55}
        />
        <OrbitRing
          radius={3.15}
          tilt={[1.5, 0.6, -0.3]}
          speed={0.04}
          color="#6e8fff"
          opacity={0.78}
        />
        <OrbitDot
          radius={2.12}
          tilt={[1.35, 0.2, 0]}
          speed={0.5}
          offset={0}
          size={0.05}
          color="#bfe4ff"
        />
        <OrbitDot
          radius={2.62}
          tilt={[1.15, -0.45, 0.4]}
          speed={-0.36}
          offset={2}
          size={0.04}
          color="#6ce6ff"
        />
        <OrbitDot
          radius={3.15}
          tilt={[1.5, 0.6, -0.3]}
          speed={0.24}
          offset={4}
          size={0.035}
          color="#7fa9ff"
        />
        <Particles />
      </Parallax>

      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#05070d"]} />
        <Lightformer intensity={2.4} color="#8fc0ff" position={[0, 4, -6]} scale={[10, 4, 1]} />
        <Lightformer intensity={1.8} color="#39d9ff" position={[-6, -1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer intensity={1.4} color="#2f6bff" position={[6, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]} />
      </Environment>

      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>

      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </Canvas>
  );
}
