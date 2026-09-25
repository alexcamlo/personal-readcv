"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./page.module.css";

const colors = {
  Back: "#242124",
  Front: "#3d3d3d",
  palm_rest: "#595959",
};

export default function CaseViewer() {
  const container = useRef<HTMLDivElement>(null);
  const exploded = useRef(false);
  const setView = useRef<(top: boolean) => void>(() => {});
  const [isExploded, setIsExploded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    let disposed = false;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbbbbbb);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    element.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 3));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 2, 3);
    scene.add(light);

    const parts: { mesh: THREE.Mesh; offset: THREE.Vector3 }[] = [];
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const manager = new THREE.LoadingManager();
    new MTLLoader(manager).load("/winsplit.mtl", (materials) => {
      if (disposed) return;
      materials.preload();
      for (const [name, color] of Object.entries(colors)) {
        (materials.materials[name] as THREE.MeshPhongMaterial | undefined)?.color.set(color);
      }
      const loader = new OBJLoader(manager);
      loader.setMaterials(materials);
      loader.load("/winsplit.obj", (model) => {
        if (disposed) return;
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const name = (child.material as THREE.Material).name;
          child.geometry.computeBoundingBox();
          const offset = new THREE.Vector3(
            child.geometry.boundingBox?.getCenter(new THREE.Vector3()).x ?? 0,
            name === "Back" ? -24 : name === "Front" ? 24 : 56,
            0,
          );
          offset.x = Math.sign(offset.x) * 18;
          parts.push({ mesh: child, offset });
        });
        scene.add(model);
        setReady(true);
        const size = bounds.getSize(new THREE.Vector3());
        const distance =
          Math.max(size.y, size.x / camera.aspect, size.z) /
          (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
        setView.current = (top) => {
          controls.target.set(0, 0, 0);
          camera.position.set(0, top ? distance : distance * 0.75, top ? 0.001 : distance * 0.75);
          camera.lookAt(0, 0, 0);
          controls.update();
        };
        setView.current(false);
      });
    });

    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resize.observe(element);
    let frame = 0;
    let last = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const origin = new THREE.Vector3();
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      const step = reducedMotion.matches
        ? 1
        : 1 - Math.exp(-(time - (last || time)) / 180);
      last = time;
      for (const { mesh, offset } of parts) {
        mesh.position.lerp(exploded.current ? offset : origin, step);
      }
      controls.update();
      renderer.render(scene, camera);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) {
        last = 0;
        frame = requestAnimationFrame(animate);
      }
    });
    visibility.observe(element);

    return () => {
      disposed = true;
      visibility.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      controls.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={styles.caseViewerWrapper}>
      <div
        ref={container}
        className={styles.caseViewer}
        role="img"
        aria-label="3D model of the custom keyboard case; drag to rotate or use the view buttons below"
      />
      <div className={styles.viewerControls} role="group" aria-label="Model views">
        <button type="button" disabled={!ready} onClick={() => setView.current(false)}>
          Angled view
        </button>
        <button type="button" disabled={!ready} onClick={() => setView.current(true)}>
          Top view
        </button>
        <button
          type="button"
          disabled={!ready}
          aria-pressed={isExploded}
          onClick={() => {
            exploded.current = !exploded.current;
            setIsExploded(exploded.current);
          }}
        >
          {isExploded ? "Assemble" : "Explode view"}
        </button>
      </div>
    </div>
  );
}
