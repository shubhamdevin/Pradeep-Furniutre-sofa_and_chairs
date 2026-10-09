'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeDAssetItem } from '@/lib/types';
import { 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Eye, 
  Info, 
  ExternalLink, 
  AlertCircle,
  Sparkles,
  Layers,
  Compass
} from 'lucide-react';

interface ViewerProps {
  asset?: ThreeDAssetItem | null;
  productTitle?: string;
  className?: string;
  initialHeight?: string;
}

export default function InteractiveFurnitureViewer({
  asset,
  productTitle = 'Bespoke Atelier Furniture',
  className = '',
  initialHeight = 'h-[500px] md:h-[600px]',
}: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showAttribution, setShowAttribution] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'perspective' | 'front' | 'side' | 'top'>('perspective');

  // References to keep Three.js objects alive during re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Default fallback asset if none provided (e.g. Poly Haven Sofa 03)
  const currentAsset: ThreeDAssetItem = asset || {
    id: 'asset-3d-sofa-03',
    name: 'Poly Haven Sofa 03 (Interactive 3D)',
    provider: 'POLY_HAVEN',
    embedMode: 'HOSTED_GLB',
    modelUrl: '/models/sofa_03/sofa_03_1k.gltf',
    author: 'Poly Haven Contributors (Dmitry Tretyakov & Rob Tuytel)',
    licence: 'CC0 1.0 Universal Public Domain',
    attributionUrl: 'https://polyhaven.com/a/sofa_03',
    posterImageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    fileFormat: 'gltf',
    loadingStatus: 'VERIFIED',
    isAccurateRep: false,
    disclaimer: 'Third-party 3D model used under CC0 license for interactive 360° demonstration. Manufactured finishes are custom crafted to order.',
    initialCameraPos: '0, 1.4, 3.2',
    isEnabled: true,
  };

  const isSketchfab = currentAsset.embedMode === 'SKETCHFAB_EMBED' || currentAsset.provider === 'SKETCHFAB';

  // Three.js Loader Effect for Hosted Models
  useEffect(() => {
    if (isSketchfab) {
      setLoading(false);
      return;
    }

    if (!canvasRef.current || !containerRef.current) return;

    let isMounted = true;
    setLoading(true);
    setLoadError(null);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8F5'); // Ivory-50 studio background
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.2, 1.4, 3.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera from going underneath the floor
    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0); // Warm studio key light
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 1.2); // Cool fill light
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff0d0, 1.0); // Soft rim back light
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // 6. Atelier Shadow Floor Plinth
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Subtle showroom grid ring
    const gridHelper = new THREE.GridHelper(10, 20, 0xdfd4c2, 0xede5d9);
    gridHelper.position.y = -0.012;
    scene.add(gridHelper);

    // 7. Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      currentAsset.modelUrl,
      (gltf) => {
        if (!isMounted) return;

        const model = gltf.scene;
        modelRef.current = model;

        // Auto-center and normalize scale
        const initialBox = new THREE.Box3().setFromObject(model);
        const initialSize = initialBox.getSize(new THREE.Vector3());

        // Adjust scale so model comfortably fits the camera frame
        const maxDim = Math.max(initialSize.x, initialSize.y, initialSize.z);
        if (maxDim > 2.8) {
          const scale = 2.2 / maxDim;
          model.scale.set(scale, scale, scale);
        } else if (maxDim < 0.8) {
          const scale = 1.6 / maxDim;
          model.scale.set(scale, scale, scale);
        }

        // Recompute bounding box after scaling and center on ground
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        model.position.x = -scaledCenter.x;
        model.position.y = -scaledBox.min.y;
        model.position.z = -scaledCenter.z;

        // Set orbit control target to model center
        if (controlsRef.current) {
          controlsRef.current.target.set(0, (scaledBox.max.y - scaledBox.min.y) * 0.45, 0);
          controlsRef.current.update();
        }

        // Enable shadows and enhance materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness, 0.4);
            }
          }
        });

        scene.add(model);
        setLoading(false);
      },
      (progress) => {
        // Progress can be monitored
      },
      (error) => {
        console.error('Error loading 3D asset:', error);
        if (isMounted) {
          setLoadError('Interactive 3D model could not be loaded directly. Switching to high-res atelier photography preview.');
          setLoading(false);
        }
      }
    );

    // 8. Animation Loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (rendererRef.current) rendererRef.current.dispose();
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [currentAsset.modelUrl, isSketchfab]);

  // Update autoRotate in controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Camera Presets
  const applyPreset = (preset: 'perspective' | 'front' | 'side' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);
    setAutoRotate(false);

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (preset) {
      case 'perspective':
        camera.position.set(2.2, 1.4, 3.0);
        break;
      case 'front':
        camera.position.set(0, 1.0, 3.4);
        break;
      case 'side':
        camera.position.set(3.4, 1.0, 0);
        break;
      case 'top':
        camera.position.set(0, 4.0, 0.5);
        break;
    }
    controls.target.set(0, 0.6, 0);
    controls.update();
  };

  // Wireframe Inspection Toggle
  const toggleWireframe = () => {
    if (!modelRef.current) return;
    const newWireframe = !wireframe;
    setWireframe(newWireframe);
    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m: any) => {
            if (m && 'wireframe' in m) m.wireframe = newWireframe;
          });
        } else if (mesh.material && 'wireframe' in mesh.material) {
          (mesh.material as any).wireframe = newWireframe;
        }
      }
    });
  };

  // Reset Camera
  const resetCamera = () => {
    applyPreset('perspective');
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${initialHeight} bg-ivory-50 rounded-2xl overflow-hidden border border-ivory-300 shadow-luxury transition-all select-none ${className}`}
    >
      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-charcoal/90 text-ivory-100 text-xs font-medium tracking-wider uppercase rounded-full backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Interactive 360° Studio</span>
        </span>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-cream/90 text-walnut text-xs font-semibold rounded-full border border-gold/30">
          {currentAsset.provider === 'POLY_HAVEN' ? 'Poly Haven CC0 GLTF' : currentAsset.provider === 'SKETCHFAB' ? 'Sketchfab 3D Embed' : 'Atelier 3D'}
        </span>
      </div>

      {/* Top Right Tool Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <button
          onClick={() => setShowAttribution(!showAttribution)}
          title="Asset Details & Licensing Attribution (Section 7)"
          className="p-2 bg-white/80 hover:bg-white text-charcoal rounded-full border border-ivory-300 shadow-sm backdrop-blur transition-colors"
        >
          <Info className="w-4 h-4 text-walnut" />
        </button>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          className="p-2 bg-white/80 hover:bg-white text-charcoal rounded-full border border-ivory-300 shadow-sm backdrop-blur transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Sketchfab Embed View Mode */}
      {isSketchfab ? (
        <div className="w-full h-full relative">
          <iframe
            title={currentAsset.name}
            src={currentAsset.modelUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      ) : (
        /* Hosted Three.js Canvas View Mode */
        <div className="w-full h-full relative">
          {loadError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-ivory-100">
              <AlertCircle className="w-12 h-12 text-gold mb-3" />
              <h4 className="font-serif text-xl text-charcoal mb-2">High-Resolution Atelier View</h4>
              <p className="text-sm text-charcoal/70 max-w-md mb-4">{loadError}</p>
              {currentAsset.posterImageUrl && (
                <div className="w-full max-w-md h-64 rounded-xl overflow-hidden shadow-md relative">
                  <img
                    src={currentAsset.posterImageUrl}
                    alt={productTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />
          )}

          {/* Loading Overlay */}
          {loading && !loadError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ivory-50/90 backdrop-blur-sm">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
                <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin" />
              </div>
              <p className="font-serif text-charcoal text-base font-medium tracking-wide">Loading 3D Geometry...</p>
              <p className="text-xs text-walnut mt-1">Inspecting solid frame & upholstery contours</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Control Bar for Hosted Mode */}
      {!isSketchfab && !loadError && (
        <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Camera View Angle Presets */}
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-ivory-300 shadow-md pointer-events-auto">
            <span className="text-[10px] uppercase font-semibold text-walnut px-2 hidden sm:inline">Views:</span>
            <button
              onClick={() => applyPreset('perspective')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                activePreset === 'perspective' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              Perspective
            </button>
            <button
              onClick={() => applyPreset('front')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                activePreset === 'front' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => applyPreset('side')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                activePreset === 'side' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              Side
            </button>
            <button
              onClick={() => applyPreset('top')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                activePreset === 'top' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              Top Plan
            </button>
          </div>

          {/* Interactive Utility Controls */}
          <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-ivory-300 shadow-md pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              className={`p-2 rounded-lg text-xs flex items-center space-x-1 transition-colors ${
                autoRotate ? 'bg-gold/20 text-walnut font-medium' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{autoRotate ? 'Rotating' : 'Rotate'}</span>
            </button>

            <button
              onClick={toggleWireframe}
              title="Toggle Structural Wireframe Mesh"
              className={`p-2 rounded-lg text-xs flex items-center space-x-1 transition-colors ${
                wireframe ? 'bg-charcoal text-white' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mesh</span>
            </button>

            <button
              onClick={resetCamera}
              title="Reset Camera Target"
              className="p-2 text-charcoal hover:bg-ivory-100 rounded-lg text-xs flex items-center space-x-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Drag & Pinch Instruction Overlay Hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-60 hover:opacity-100 transition-opacity hidden sm:block">
        <span className="text-[11px] text-charcoal/80 bg-white/80 px-3 py-1 rounded-full backdrop-blur border border-ivory-300">
          Click & drag to rotate • Scroll to zoom
        </span>
      </div>

      {/* Asset Registry & Attribution Modal (Section 7.5 Compliance) */}
      {showAttribution && (
        <div className="absolute inset-0 z-30 bg-charcoal/70 backdrop-blur-sm p-4 md:p-6 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-ivory-300 relative text-charcoal">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Asset Registry Record</span>
                <h4 className="font-serif text-lg text-charcoal mt-0.5">{currentAsset.name}</h4>
              </div>
              <button
                onClick={() => setShowAttribution(false)}
                className="text-charcoal/50 hover:text-charcoal text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Provider / Host:</span>
                <span className="font-semibold">{currentAsset.provider} ({currentAsset.embedMode})</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Author / Creator:</span>
                <span className="font-semibold">{currentAsset.author}</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Licence:</span>
                <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{currentAsset.licence}</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Commercial Rights:</span>
                <span className="font-semibold">Verified for commercial digital display</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Status:</span>
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{currentAsset.loadingStatus}</span>
              </div>
              <div className="pt-1 text-[11px] text-charcoal/70 leading-relaxed italic bg-ivory-50 p-2.5 rounded-lg border border-ivory-200">
                <strong>Disclaimer:</strong> {currentAsset.disclaimer || 'Third-party 3D model used for interactive ergonomic & volumetric exploration. Actual manufactured piece is tailored with client-selected solid teak frames and fabric swatches.'}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-ivory-200">
              <a
                href={currentAsset.attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-gold hover:text-gold-dark font-medium underline"
              >
                <span>View Original Source Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setShowAttribution(false)}
                className="px-4 py-1.5 bg-charcoal text-white text-xs rounded-lg hover:bg-charcoal-light transition-colors font-medium"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
