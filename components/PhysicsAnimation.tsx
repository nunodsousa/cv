/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PhysicsAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // slate-900
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create a double pendulum system
    const pendulum1 = {
      length: 3,
      angle: Math.PI / 3,
      velocity: 0,
      mass: 1,
      position: new THREE.Vector3(),
      line: null as THREE.Line | null,
      sphere: null as THREE.Mesh | null
    };

    const pendulum2 = {
      length: 2.5,
      angle: Math.PI / 4,
      velocity: 0,
      mass: 0.8,
      position: new THREE.Vector3(),
      line: null as THREE.Line | null,
      sphere: null as THREE.Mesh | null
    };

    const g = 0.01; // Gravity constant
    const damping = 0.995; // Damping factor

    // Create materials
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
    const sphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.7, roughness: 0.3 });
    const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.3 });

    // Create first pendulum
    const lineGeometry1 = new THREE.BufferGeometry();
    const line1 = new THREE.Line(lineGeometry1, lineMaterial);
    scene.add(line1);
    pendulum1.line = line1;

    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
    scene.add(sphere1);
    pendulum1.sphere = sphere1;

    // Create second pendulum
    const lineGeometry2 = new THREE.BufferGeometry();
    const line2 = new THREE.Line(lineGeometry2, lineMaterial);
    scene.add(line2);
    pendulum2.line = line2;

    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    scene.add(sphere2);
    pendulum2.sphere = sphere2;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Trail for second pendulum
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, opacity: 0.3, transparent: true });
    const trailPoints: THREE.Vector3[] = [];
    const maxTrailPoints = 200;
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update pendulum physics (simplified double pendulum)
      const dt = 0.1;

      // First pendulum
      const acc1 = -g / pendulum1.length * Math.sin(pendulum1.angle);
      pendulum1.velocity += acc1 * dt;
      pendulum1.velocity *= damping;
      pendulum1.angle += pendulum1.velocity * dt;

      // Second pendulum (relative to first)
      const acc2 = -g / pendulum2.length * Math.sin(pendulum2.angle) - 
                   Math.cos(pendulum2.angle - pendulum1.angle) * acc1;
      pendulum2.velocity += acc2 * dt;
      pendulum2.velocity *= damping;
      pendulum2.angle += pendulum2.velocity * dt;

      // Calculate positions
      pendulum1.position.set(
        Math.sin(pendulum1.angle) * pendulum1.length,
        -Math.cos(pendulum1.angle) * pendulum1.length,
        0
      );

      pendulum2.position.set(
        pendulum1.position.x + Math.sin(pendulum2.angle) * pendulum2.length,
        pendulum1.position.y - Math.cos(pendulum2.angle) * pendulum2.length,
        0
      );

      // Update first pendulum line
      const line1Points = [
        new THREE.Vector3(0, 0, 0),
        pendulum1.position
      ];
      pendulum1.line!.geometry.setFromPoints(line1Points);

      // Update first pendulum sphere
      pendulum1.sphere!.position.copy(pendulum1.position);

      // Update second pendulum line
      const line2Points = [
        pendulum1.position,
        pendulum2.position
      ];
      pendulum2.line!.geometry.setFromPoints(line2Points);

      // Update second pendulum sphere
      pendulum2.sphere!.position.copy(pendulum2.position);

      // Update trail
      trailPoints.push(pendulum2.position.clone());
      if (trailPoints.length > maxTrailPoints) {
        trailPoints.shift();
      }
      trail.geometry.setFromPoints(trailPoints);

      // Rotate camera slightly for better view
      camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
      camera.lookAt(0, -2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-96 md:h-[500px] rounded-xl overflow-hidden border border-slate-700 bg-slate-900" ref={containerRef} />
  );
};

export default PhysicsAnimation;
