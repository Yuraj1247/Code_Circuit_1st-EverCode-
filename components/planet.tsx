"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

interface PlanetProps {
  position: [number, number, number]
  size: number
  color: string
  name: string
  onClick: () => void
  onHover: () => void
  onHoverEnd: () => void
  isHovered: boolean
  texture?: string
}

export function Planet({ position, size, color, name, onClick, onHover, onHoverEnd, isHovered, texture }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [textureMap, setTextureMap] = useState<THREE.Texture | null>(null)

  // Load texture if provided
  useState(() => {
    if (texture) {
      new THREE.TextureLoader().load(texture, (loadedTexture) => {
        setTextureMap(loadedTexture)
      })
    }
  })

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005

      // Scale up when hovered
      if (isHovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, size * 1.2, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, size * 1.2, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, size * 1.2, 0.1)
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, size, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, size, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, size, 0.1)
      }
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick} onPointerOver={onHover} onPointerOut={onHoverEnd}>
        <sphereGeometry args={[1, 32, 32]} />
        {textureMap ? <meshStandardMaterial map={textureMap} /> : <meshStandardMaterial color={color} />}
      </mesh>

      {isHovered && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center whitespace-nowrap">
            <p className="font-bold">{name}</p>
            <p className="text-xs text-gray-300">Click to explore</p>
          </div>
        </Html>
      )}
    </group>
  )
}
