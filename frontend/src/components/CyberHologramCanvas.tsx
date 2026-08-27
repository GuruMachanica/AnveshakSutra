import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js';

export const CyberHologramCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 115;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Denser Particle Constellation Network (260 star nodes for richer interconnectivity)
    const particleCount = 260;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 290;
      positions[i + 1] = (Math.random() - 0.5) * 160;
      positions[i + 2] = (Math.random() - 0.5) * 110;

      const intensity = 0.35 + Math.random() * 0.45;
      colors[i] = intensity;
      colors[i + 1] = intensity;
      colors[i + 2] = intensity;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.95,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // 2. Holographic Orbital Rings & Latitude Geometric Circles
    const ringGroup = new THREE.Group();
    
    // Outer Orbital Ring
    const ringGeo1 = new THREE.RingGeometry(40, 40.25, 96);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.09 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3.2;
    ringGroup.add(ring1);

    // Secondary Equatorial Ring
    const ringGeo2 = new THREE.RingGeometry(28, 28.25, 72);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.13 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.8;
    ringGroup.add(ring2);

    // Tertiary Vertical Meridian Ring
    const ringGeo3 = new THREE.RingGeometry(18, 18.2, 48);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.y = Math.PI / 2.5;
    ringGroup.add(ring3);

    // Central Star Core (Delicate octahedron wireframe)
    const coreGeo = new THREE.OctahedronGeometry(3.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.22 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    ringGroup.add(coreMesh);

    scene.add(ringGroup);

    // 3. Dense Dynamic Constellation Connecting Lines (Higher density & connection links)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.065 });
    const maxLineSegments = particleCount * 25;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // Interactive Cursor Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / container.clientHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Anime.js Subtle Breathing Pulses
    if (typeof anime === 'function') {
      anime({
        targets: coreMesh.scale,
        x: [1, 1.25],
        y: [1, 1.25],
        z: [1, 1.25],
        duration: 4000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
      });

      anime({
        targets: ringMat2,
        opacity: [0.06, 0.18],
        duration: 3200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad',
      });
    }

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      targetX += (mouseX * 16 - targetX) * 0.035;
      targetY += (mouseY * 16 - targetY) * 0.035;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Slow orbital drift
      particles.rotation.y += 0.00045;
      particles.rotation.x += 0.00018;

      ringGroup.rotation.y -= 0.001;
      ringGroup.rotation.z += 0.0005;
      coreMesh.rotation.y += 0.0035;
      coreMesh.rotation.x += 0.0025;

      // Update Dynamic Connecting Lines with increased link distance threshold
      let lineIdx = 0;
      const posArray = geometry.attributes.position.array as Float32Array;
      const currentLinePosArray = lineGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          // Increased connection threshold for denser line network
          if (distSq < 720 && lineIdx < maxLineSegments * 6 - 6) {
            currentLinePosArray[lineIdx++] = posArray[i * 3];
            currentLinePosArray[lineIdx++] = posArray[i * 3 + 1];
            currentLinePosArray[lineIdx++] = posArray[i * 3 + 2];

            currentLinePosArray[lineIdx++] = posArray[j * 3];
            currentLinePosArray[lineIdx++] = posArray[j * 3 + 1];
            currentLinePosArray[lineIdx++] = posArray[j * 3 + 2];
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx / 3);
      lineGeo.attributes.position.needsUpdate = true;

      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pMaterial.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" 
    />
  );
};
