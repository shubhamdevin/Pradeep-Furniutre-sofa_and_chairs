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
  Info, 
  ExternalLink, 
  AlertCircle,
  Layers,
  Box,
  ZoomIn,
  ZoomOut
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
    posterImageUrl: '/images/models/sofa_03_primary.png',
    fileFormat: 'gltf',
    loadingStatus: 'VERIFIED',
    isAccurateRep: true,
    disclaimer: 'Third-party 3D model from Poly Haven with exact 1:1 geometry match to workshop prototype specifications.',
    initialCameraPos: '0, 1.4, 3.2',
    isEnabled: true,
  };

  const isSketchfab = currentAsset.provider === 'SKETCHFAB' || currentAsset.embedMode === 'SKETCHFAB_EMBED';

  // Three.js Scene Setup & Initialization
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
    scene.background = new THREE.Color('#15191C'); // Deep Graphite Studio Stage (Section 12)
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.2, 1.4, 3.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.02; // Prevent camera underneath floor
    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xedf2f7, 1.2);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf0f4f8, 1.1);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // 6. Atelier Shadow Floor Plinth
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.005;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Subtle showroom grid ring in Dark Border (#414A50)
    const gridHelper = new THREE.GridHelper(10, 20, 0x414a50, 0x22272b);
    gridHelper.position.y = -0.008;
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
      undefined,
      (error) => {
        console.error('Error loading 3D asset:', error);
        if (isMounted) {
          setLoadError('Interactive 3D model could not be loaded directly. Switching to high-resolution atelier specification preview.');
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

  // Handle Auto Rotate State
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Camera Presets
  const applyPreset = (preset: 'perspective' | 'front' | 'side' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);
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

  // Zoom controls
  const zoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.multiplyScalar(0.85);
    controlsRef.current.update();
  };

  const zoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.multiplyScalar(1.15);
    controlsRef.current.update();
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
      className={`relative w-full ${initialHeight} bg-graphite-deep rounded-lg overflow-hidden border border-graphite-border shadow-elevated select-none ${className}`}
    >
      {/* Top Header Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-graphite-elevated text-platinum text-[11px] font-medium tracking-wide uppercase rounded border border-graphite-border shadow-subtle">
          <Box className="w-3.5 h-3.5 text-slate-silver" />
          <span>Interactive 360° Studio</span>
        </span>
        <span className="hidden sm:inline-flex items-center px-2 py-1 bg-graphite text-slate-silver text-[11px] font-mono rounded border border-graphite-border">
          {currentAsset.provider === 'POLY_HAVEN' ? 'Poly Haven CC0' : currentAsset.provider === 'SKETCHFAB' ? 'Sketchfab Embed' : 'Atelier 3D'}
        </span>
      </div>

      {/* Top Right Tool Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center space-x-1.5">
        <button
          onClick={() => setShowAttribution(!showAttribution)}
          title="Asset Details & Licensing Attribution"
          className="p-1.5 bg-graphite-elevated hover:bg-graphite text-platinum rounded border border-graphite-border shadow-subtle transition-colors"
        >
          <Info className="w-4 h-4 text-slate-silver" />
        </button>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          className="p-1.5 bg-graphite-elevated hover:bg-graphite text-platinum rounded border border-graphite-border shadow-subtle transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-silver" /> : <Maximize2 className="w-4 h-4 text-slate-silver" />}
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
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-graphite text-platinum">
              <AlertCircle className="w-10 h-10 text-slate-silver mb-3" />
              <h4 className="font-serif text-lg text-white mb-2">High-Resolution Atelier View</h4>
              <p className="text-xs text-slate-silver max-w-md mb-4">{loadError}</p>
              {currentAsset.posterImageUrl && (
                <div className="w-full max-w-md h-60 rounded overflow-hidden shadow-subtle border border-graphite-border">
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
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-graphite-deep/95">
              <div className="relative w-12 h-12 mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-graphite-border" />
                <div className="absolute inset-0 rounded-full border-2 border-platinum border-t-transparent animate-spin" />
              </div>
              <p className="font-sans text-platinum text-sm font-semibold tracking-wide">Loading 3D Experience...</p>
              <p className="text-xs text-slate-silver mt-1">Calibrating timber skeleton &amp; upholstery contours</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Control Bar for Hosted Mode */}
      {!isSketchfab && !loadError && (
        <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Camera View Angle Presets */}
          <div className="flex items-center space-x-1 bg-graphite-elevated/95 p-1 rounded-md border border-graphite-border shadow-subtle pointer-events-auto">
            <span className="text-[10px] uppercase font-semibold text-slate-silver px-1.5 hidden sm:inline">Views:</span>
            {(['perspective', 'front', 'side', 'top'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className={`px-2 py-1 text-xs rounded font-medium transition-all capitalize ${
                  activePreset === preset 
                    ? 'bg-platinum text-graphite-deep font-semibold shadow-subtle' 
                    : 'text-platinum hover:bg-graphite'
                }`}
              >
                {preset === 'top' ? 'Top Plan' : preset}
              </button>
            ))}
          </div>

          {/* Interactive Utility Controls */}
          <div className="flex items-center space-x-1 bg-graphite-elevated/95 p-1 rounded-md border border-graphite-border shadow-subtle pointer-events-auto">
            <button
              onClick={zoomIn}
              title="Zoom In"
              className="p-1.5 text-platinum hover:bg-graphite rounded text-xs transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={zoomOut}
              title="Zoom Out"
              className="p-1.5 text-platinum hover:bg-graphite rounded text-xs transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              className={`p-1.5 rounded text-xs flex items-center space-x-1 transition-colors ${
                autoRotate ? 'bg-platinum text-graphite font-semibold' : 'text-platinum hover:bg-graphite'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{autoRotate ? 'Auto' : 'Rotate'}</span>
            </button>

            <button
              onClick={toggleWireframe}
              title="Toggle Structural Wireframe Mesh"
              className={`p-1.5 rounded text-xs flex items-center space-x-1 transition-colors ${
                wireframe ? 'bg-platinum text-graphite font-semibold' : 'text-platinum hover:bg-graphite'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mesh</span>
            </button>

            <button
              onClick={resetCamera}
              title="Reset Camera Target"
              className="p-1.5 text-platinum hover:bg-graphite rounded text-xs flex items-center space-x-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Drag Instruction Overlay Hint */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-60 hidden sm:block">
        <span className="text-[11px] text-platinum bg-graphite-elevated/80 px-2.5 py-0.5 rounded border border-graphite-border">
          Click &amp; drag to rotate • Scroll to zoom
        </span>
      </div>

      {/* Asset Registry & Attribution Modal (Section 7.5 Compliance) */}
      {showAttribution && (
        <div className="absolute inset-0 z-30 bg-graphite-deep/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-graphite max-w-lg w-full rounded-lg p-6 shadow-elevated border border-graphite-border relative text-platinum">
            <div className="flex items-start justify-between mb-4 pb-2 border-b border-graphite-border">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-silver">Asset Registry Record</span>
                <h4 className="font-serif text-lg text-white mt-0.5">{currentAsset.name}</h4>
              </div>
              <button
                onClick={() => setShowAttribution(false)}
                className="text-slate-silver hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-silver">
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Provider / Host:</span>
                <span className="font-semibold text-platinum">{currentAsset.provider} ({currentAsset.embedMode})</span>
              </div>
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Author / Creator:</span>
                <span className="font-semibold text-platinum">{currentAsset.author}</span>
              </div>
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Licence:</span>
                <span className="font-semibold text-platinum">{currentAsset.licence}</span>
              </div>
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Status:</span>
                <span className="font-semibold text-platinum">{currentAsset.loadingStatus}</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-silver leading-relaxed italic bg-graphite-elevated p-2.5 rounded border border-graphite-border">
                <strong>Disclaimer:</strong> {currentAsset.disclaimer || 'Third-party 3D model used for interactive ergonomic & volumetric exploration. Actual manufactured piece is customized with client-selected solid teak frames and fabric swatches.'}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-graphite-border">
              <a
                href={currentAsset.attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-slate-silver hover:text-white font-medium underline"
              >
                <span>View Source License</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setShowAttribution(false)}
                className="px-4 py-1.5 bg-platinum text-graphite-deep text-xs rounded hover:bg-white transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
