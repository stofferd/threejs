import * as THREE from 'three';
import {
    LineSegments,
    LineBasicMaterial,
    EdgesGeometry,
    MeshPhongMaterial,
    SphereBufferGeometry,
    MeshLambertMaterial,
    SphereGeometry,
    MeshStandardMaterial,
    MeshDepthMaterial,
} from 'three';
import React, { Suspense } from 'react';
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import noiseUrl from './noise.jpg';

extend({
    OrbitControls,
    EdgesGeometry,
    LineSegments,
    LineBasicMaterial,
    MeshPhongMaterial,
    SphereBufferGeometry,
    SphereGeometry,
    MeshStandardMaterial,
    MeshDepthMaterial,
});

function Effect() {
    const composer = React.useRef();
    const { scene, gl, size, camera } = useThree();
    const aspect = React.useMemo(
        () => new THREE.Vector2(size.width, size.height),
        [size],
    );
    React.useEffect(
        () => void composer.current.setSize(size.width, size.height),
        [size],
    );
    useFrame(() => composer.current.render(), 1);

    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass
                attachArray="passes"
                scene={scene}
                camera={camera}
                antialias={true}
            />
            <unrealBloomPass
                attachArray="passes"
                args={[aspect]}
                strength={0.6}
                radius={0.1}
                threshold={0.3}
            />
            {/* <shaderPass
                attachArray="passes"
                args={[FXAAShader]}
                color="0x00ff00"
                uniforms-resolution-value={[
                    window.innerWidth * window.devicePixelRatio,
                    window.innerHeight * window.devicePixelRatio,
                ]}
                // uniforms-edgeIntensity={0.1}
                // uniforms={{ bIntensity: 0.5 }}
                renderToScreen
            /> */}
            <filmPass attachArray="passes" args={[0.25, 1, 1500, false]} />
            {/* noiseIntensity 
            scanlinesIntensity
            scanlinesCount
            grayscale  */}
        </effectComposer>
    );
}

const Controls = () => {
    const { camera, gl } = useThree();
    const ref = React.useRef();
    useFrame(() => ref.current.update());
    return (
        <orbitControls
            ref={ref}
            target={[0, 0, 0]}
            enableDamping
            args={[camera, gl.domElement]}
        />
    );
};

const Ball = () => {
    const mesh = React.useRef(null);
    let expanding = true;
    useFrame((clock) => {
        mesh.current.geometry.parameters.radius = mesh.current.geometry.parameters.radius += 1;
        mesh.current.geometry.parameters.phiStart = mesh.current.geometry.parameters.phiStart += 1;
        mesh.current.rotation.x = mesh.current.rotation.y += 0.001;
        mesh.current.rotation.y = mesh.current.rotation.z += 0.001;

        if (expanding) {
            mesh.current.scale.x = mesh.current.scale.x += 0.0005;
            mesh.current.scale.y = mesh.current.scale.y += 0.0005;
            mesh.current.scale.z = mesh.current.scale.z += 0.0005;
        } else {
            mesh.current.scale.x = mesh.current.scale.x -= 0.0005;
            mesh.current.scale.y = mesh.current.scale.y -= 0.0005;
            mesh.current.scale.z = mesh.current.scale.z -= 0.0005;
        }
        if (mesh.current.scale.x >= 1.5) {
            expanding = false;
        }
        if (mesh.current.scale.x <= 0.9) {
            expanding = true;
        }
    });

    return (
        <mesh ref={mesh}>
            <sphereGeometry
                attach="geometry"
                args={[0.5, 32, 32]}

                // radius={10}
                // widthSegments={32}
                // heightSegments={32}
                // phiStart={1}
                // phiLength={1}
                // thetaStart={1}
                // thetaLength={1}
            />
            <meshStandardMaterial
                attach="material"
                color="#fff"
                emissive="red"
                displacementMap={new THREE.TextureLoader().load(noiseUrl)}
                displacementScale={0.2}
                map={new THREE.TextureLoader().load(noiseUrl)}
            />
        </mesh>
    );
};

const Globe = () => {
    // const geometry = new THREE.SphereBufferGeometry(1, 10, 10, 0, 2);
    // const edges = new THREE.EdgesGeometry(geometry);

    return (
        <>
            <Canvas
                camera={{
                    fov: 75,
                    position: [1, -1, 5],
                }}
                style={{ background: '#000' }}
            >
                <ambientLight intensity={1} color="#fff" />
                {/* <spotLight intensity={2.5} position={[1, -1, 5]} /> */}
                position: [1, -1, 5],
                <mesh>
                    <sphereBufferGeometry
                        attach="geometry"
                        args={[4, 32, 32]}
                    />

                    <meshDepthMaterial
                        attach="material"
                        color="white"
                        side={THREE.BackSide}
                    />
                    {/* <meshLambertMaterial
                        attach="material"
                        color="white"
                        side={THREE.BackSide}
                    /> */}
                </mesh>
                <Ball />
                {/* <edgesGeometry attach="geometry" args={geometry} /> */}
                <mesh>
                    <sphereBufferGeometry
                        attach="geometry"
                        args={[0.9, 32, 32, 0, 5]}
                    />
                    <meshLambertMaterial attach="material" color="white" />

                    {/* <meshDepthMaterial attach="material" color="white" /> */}
                </mesh>
                <mesh>
                    <sphereBufferGeometry
                        attach="geometry"
                        args={[0.9, 32, 32, 0, 5]}
                    />
                    <meshLambertMaterial
                        attach="material"
                        color="#920"
                        side={THREE.BackSide}
                    />
                </mesh>
                <mesh>
                    <sphereBufferGeometry
                        emissive="#a42"
                        attach="geometry"
                        args={[0.3, 32, 32]}
                    />
                    <meshLambertMaterial attach="material" color="#333" />
                </mesh>
                <Controls />
                <Effect />
            </Canvas>
        </>
    );
};

export default Globe;
