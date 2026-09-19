'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Interactive WebGL globe rendered imperatively with three.js (no react-reconciler).
// Reacts to cursor: tilts toward pointer while continuously spinning.
export default function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let width = mount.clientWidth || 400;
    let height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return; // WebGL unavailable — fallback handled by parent
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Fibonacci sphere of points (brand teal)
    const count = 2800;
    const r = 1.55;
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      positions[i * 3] = Math.cos(th) * rad * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = Math.sin(th) * rad * r;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pm = new THREE.PointsMaterial({ size: 0.03, color: 0x2dd4bf, sizeAttenuation: true, transparent: true, opacity: 0.95 });
    group.add(new THREE.Points(pg, pm));

    // Cobalt wireframe shell
    const wg = new THREE.IcosahedronGeometry(1.5, 2);
    const wm = new THREE.MeshBasicMaterial({ color: 0x3b5bfd, wireframe: true, transparent: true, opacity: 0.14 });
    group.add(new THREE.Mesh(wg, wm));

    // Dark inner core
    const sg = new THREE.SphereGeometry(1.3, 48, 48);
    const sm = new THREE.MeshBasicMaterial({ color: 0x060b18, transparent: true, opacity: 0.5 });
    group.add(new THREE.Mesh(sg, sm));

    let pointerX = 0;
    let pointerY = 0;
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      const dt = clock.getDelta();
      group.rotation.y += dt * 0.12;
      group.rotation.x += (pointerY * 0.5 - group.rotation.x) * 0.06;
      group.position.x += (pointerX * 0.2 - group.position.x) * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      pg.dispose(); pm.dispose(); wg.dispose(); wm.dispose(); sg.dispose(); sm.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
