"use client";
import CanvasLoader from "@/app/components/Loader";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

const Computers = ({ isMobile }: { isMobile: boolean }) => {
	try {
		const computer = useGLTF("/desktop_pc/scene.gltf");
		return (
			<mesh>
				<hemisphereLight intensity={0.15} groundColor="black" />
				<pointLight intensity={1} />
				<spotLight
					position={[-20, 50, 10]}
					angle={0.12}
					penumbra={1}
					intensity={1}
					castShadow
					shadow-mapSize={1024}
				/>
				<primitive
					object={computer.scene}
					scale={isMobile ? 0.7 : 0.75}
					position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
					rotation={[-0.01, -0.2, -0.1]}
				/>
			</mesh>
		);
	} catch (error) {
		console.error("Error loading 3D model:", error);
		return null;
	}
};

const ComputersCanvas = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 500px)");
		setIsMobile(mediaQuery.matches);
		const handleMediaQueryChange = (event: MediaQueryListEvent | MediaQueryList) => {
			// event may be a MediaQueryListEvent (modern) or MediaQueryList (legacy listener params)
			if (typeof (event as MediaQueryListEvent).matches === "boolean") {
				setIsMobile((event as MediaQueryListEvent).matches);
			} else {
				setIsMobile((event as MediaQueryList).matches);
			}
		};

		if (typeof mediaQuery.addEventListener === "function") {
			mediaQuery.addEventListener("change", handleMediaQueryChange as any);
			return () => mediaQuery.removeEventListener("change", handleMediaQueryChange as any);
		} else if (typeof (mediaQuery as any).addListener === "function") {
			(mediaQuery as any).addListener(handleMediaQueryChange);
			return () => (mediaQuery as any).removeListener(handleMediaQueryChange);
		}
	}, []);

	if (hasError) {
		return null; // Gracefully hide the 3D model if there's an error
	}

	try {
		return (
			<Canvas
				frameloop="demand"
				shadows
				camera={{ position: [20, 3, 5], fov: 25 }}
				gl={{ preserveDrawingBuffer: true }}
				onCreated={({ gl }) => {
					// Ensure WebGL context is properly initialized
					if (!gl) {
						setHasError(true);
					}
				}}
			>
				<Suspense fallback={<CanvasLoader />}>
					<OrbitControls
						enableZoom={false}
						maxPolarAngle={Math.PI / 2}
						minPolarAngle={Math.PI / 2}
					/>
					<Computers isMobile={isMobile} />
				</Suspense>
				<Preload all />
			</Canvas>
		);
	} catch (error) {
		console.error("Canvas error:", error);
		setHasError(true);
		return null;
	}
};

export default ComputersCanvas;
