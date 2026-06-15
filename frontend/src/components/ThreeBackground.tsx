'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create Particles
    const particlesCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const speeds = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12; // x
      positions[i + 1] = (Math.random() - 0.5) * 12; // y
      positions[i + 2] = (Math.random() - 0.5) * 8; // z
      speeds[i / 3] = 0.01 + Math.random() * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Glow Gold Style Material for Light Editorial BG
    const material = new THREE.PointsMaterial({
      color: 0xC8A96B,
      size: 0.1,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse positions
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 100;
      mouseY = (e.clientY - window.innerHeight / 2) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    let animationId: number;
    const animate = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.rotation.y = targetX * 0.15;
      particles.rotation.x = -targetY * 0.15;

      const positionsArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positionsArr.length; i += 3) {
        positionsArr[i] += speeds[Math.floor(i / 3)] * 0.1;
        if (positionsArr[i] > 6) {
          positionsArr[i] = -6;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="canvas-container" />;
}
