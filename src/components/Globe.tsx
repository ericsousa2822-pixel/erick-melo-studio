import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const R = 2;
const PLACES: [string, number, number][] = [
  ["Brasil", -15.8, -47.9],
  ["Portugal", 38.7, -9.1],
  ["USA", 40.7, -74],
  ["Canada", 45.4, -75.7],
  ["España", 40.4, -3.7],
  ["UK", 51.5, -0.1],
  ["Deutschland", 52.5, 13.4],
  ["México", 19.4, -99.1],
  ["Argentina", -34.6, -58.4],
  ["Japan", 35.7, 139.7],
  ["Australia", -33.9, 151.2],
  ["UAE", 25.2, 55.3],
  ["South Africa", -33.9, 18.4],
  ["Chile", -33.4, -70.6],
];

function toVec(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function Arc({ a, b, delay }: { a: THREE.Vector3; b: THREE.Vector3; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const { geo, pulse } = useMemo(() => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.setLength(R + a.distanceTo(b) * 0.45);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return { geo: new THREE.TubeGeometry(curve, 48, 0.006, 6, false), pulse: curve };
  }, [a, b]);
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime * 0.35 + delay) % 1);
    ref.current?.position.copy(pulse.getPoint(t));
  });
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#5b8cff" transparent opacity={0.45} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Marker({ name, pos }: { name: string; pos: THREE.Vector3 }) {
  const [on, setOn] = useState(false);
  return (
    <group position={pos}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setOn(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setOn(false); document.body.style.cursor = ""; }}
        onClick={(e) => { e.stopPropagation(); setOn((v) => !v); }}
      >
        <sphereGeometry args={[on ? 0.06 : 0.04, 12, 12]} />
        <meshBasicMaterial color={on ? "#ffffff" : "#7aa2ff"} />
      </mesh>
      <mesh visible={false} onPointerOver={() => setOn(true)} onPointerOut={() => setOn(false)}>
        <sphereGeometry args={[0.14, 8, 8]} />
      </mesh>
      {on && (
        <Html center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="-translate-y-7 whitespace-nowrap rounded-full border border-ink-line bg-ink/90 px-3 py-1 font-mono text-xs text-ink-foreground backdrop-blur">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

function Earth() {
  const g = useRef<THREE.Group>(null);
  const drag = useRef({ down: false, x: 0, vel: 0 });
  const dots = useMemo(() => {
    const n = 1800;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5));
      arr.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, []);
  const pts = useMemo(() => PLACES.map(([n, la, lo]) => ({ n, v: toVec(la, lo, R + 0.01) })), []);
  const arcs = useMemo(() => {
    const br = pts[0]!.v;
    return pts.slice(1).map((p, i) => ({ a: br, b: p.v, d: i / 13 }));
  }, [pts]);

  useFrame((_, dt) => {
    if (!g.current) return;
    const d = drag.current;
    d.vel *= Math.exp(-3 * Math.min(dt, 0.05));
    g.current.rotation.y += (d.down ? 0 : 0.12 * Math.min(dt, 0.05)) + d.vel;
  });

  return (
    <group rotation={[0.35, 0, 0.1]}>
      <group
        ref={g}
        onPointerDown={(e) => { drag.current.down = true; drag.current.x = e.clientX; }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        onPointerMove={(e) => {
          if (!drag.current.down) return;
          drag.current.vel = (e.clientX - drag.current.x) * 0.0008;
          drag.current.x = e.clientX;
        }}
      >
        <mesh>
          <sphereGeometry args={[R - 0.02, 64, 64]} />
          <meshStandardMaterial color="#0b1222" roughness={0.9} metalness={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[R, 36, 18]} />
          <meshBasicMaterial color="#3d6bff" wireframe transparent opacity={0.07} />
        </mesh>
        <points geometry={dots}>
          <pointsMaterial color="#8fa8d8" size={0.018} transparent opacity={0.6} />
        </points>
        {arcs.map((a, i) => <Arc key={i} a={a.a} b={a.b} delay={a.d} />)}
        {pts.map((p) => <Marker key={p.n} name={p.n} pos={p.v} />)}
      </group>
      <mesh scale={1.12}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshBasicMaterial color="#3d6bff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => gl.domElement.parentElement?.setAttribute("data-scene-ready", "1")}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#9bb8ff" />
      <Earth />
    </Canvas>
  );
}
