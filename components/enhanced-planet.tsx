"use client"

import { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere } from "@react-three/drei"
import * as THREE from "three"
import type { Subject } from "@/lib/data"

interface EnhancedPlanetProps {
  subject: Subject
  position: [number, number, number]
  onClick: () => void
  onHover: () => void
  onHoverEnd: () => void
  isHovered: boolean
  showLabel?: boolean
}

export function EnhancedPlanet({
  subject,
  position,
  onClick,
  onHover,
  onHoverEnd,
  isHovered,
  showLabel = false,
}: EnhancedPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null)
  const [cloudTexture, setCloudTexture] = useState<THREE.Texture | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  // Planet-specific properties
  const getPlanetProperties = () => {
    switch (subject.id) {
      case "english": // Mercury-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=EnglishNormal",
          bumpScale: 0.05,
          metalness: 0.3,
          roughness: 0.7,
          cloudOpacity: 0,
          rotationSpeed: 0.005,
          description: "Explore the world of language and literature!",
        }
      case "maths": // Venus-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=MathsNormal",
          bumpScale: 0.1,
          metalness: 0.1,
          roughness: 0.8,
          cloudOpacity: 0.8,
          rotationSpeed: 0.003,
          description: "Blast into Math with this adventure!",
        }
      case "science": // Earth-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=ScienceNormal",
          bumpScale: 0.1,
          metalness: 0.1,
          roughness: 0.6,
          cloudOpacity: 0.6,
          rotationSpeed: 0.007,
          description: "Discover the wonders of science!",
        }
      case "history": // Mars-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=HistoryNormal",
          bumpScale: 0.15,
          metalness: 0.1,
          roughness: 0.9,
          cloudOpacity: 0.1,
          rotationSpeed: 0.006,
          description: "Travel through time and explore the past!",
        }
      case "arts": // Jupiter-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=ArtsNormal",
          bumpScale: 0.05,
          metalness: 0.1,
          roughness: 0.7,
          cloudOpacity: 0.7,
          rotationSpeed: 0.012,
          description: "Express yourself through creativity!",
        }
      case "hindi": // Saturn-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=HindiNormal",
          bumpScale: 0.05,
          metalness: 0.2,
          roughness: 0.6,
          cloudOpacity: 0.5,
          rotationSpeed: 0.009,
          description: "Learn the beautiful Hindi language!",
        }
      case "technology": // Uranus-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=TechnologyNormal",
          bumpScale: 0.05,
          metalness: 0.3,
          roughness: 0.5,
          cloudOpacity: 0.4,
          rotationSpeed: 0.008,
          description: "Explore the digital world of technology!",
        }
      case "reasoning": // Neptune-like
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=ReasoningNormal",
          bumpScale: 0.05,
          metalness: 0.2,
          roughness: 0.5,
          cloudOpacity: 0.6,
          rotationSpeed: 0.01,
          description: "Sharpen your mind with logic and puzzles!",
        }
      default:
        return {
          normalMapUrl: "/placeholder.svg?height=256&width=256&text=PlanetNormal",
          bumpScale: 0.1,
          metalness: 0.1,
          roughness: 0.7,
          cloudOpacity: 0.3,
          rotationSpeed: 0.005,
          description: "Explore this exciting subject!",
        }
    }
  }

  const planetProps = getPlanetProperties()

  // Load texture if provided
  useEffect(() => {
    if (subject.texture) {
      try {
        const loader = new THREE.TextureLoader()
        loader.load(
          subject.texture,
          (loadedTexture) => {
            setTexture(loadedTexture)
            setTextureLoaded(true)
          },
          undefined,
          (error) => {
            console.error(`Failed to load texture: ${subject.texture}`, error)
            setTextureLoaded(false)
          },
        )

        // Load normal map
        loader.load(
          planetProps.normalMapUrl,
          (loadedNormalMap) => {
            setNormalMap(loadedNormalMap)
          },
          undefined,
          (error) => {
            console.error(`Failed to load normal map: ${planetProps.normalMapUrl}`, error)
          },
        )

        // Load cloud texture for planets with atmosphere
        if (subject.atmosphere) {
          loader.load(
            "/placeholder.svg?height=256&width=256&text=Clouds",
            (loadedCloudTexture) => {
              setCloudTexture(loadedCloudTexture)
            },
            undefined,
            (error) => {
              console.error("Failed to load cloud texture", error)
            },
          )
        }
      } catch (error) {
        console.error(`Error loading texture: ${subject.texture}`, error)
        setTextureLoaded(false)
      }
    }
  }, [subject.texture, subject.atmosphere, planetProps.normalMapUrl])

  // Handle click to show popup
  const handlePlanetClick = () => {
    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
      onClick()
    }, 1500)
  }

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the planet
      meshRef.current.rotation.y += planetProps.rotationSpeed

      // Scale up when hovered
      if (isHovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, subject.size * 1.2, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, subject.size * 1.2, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, subject.size * 1.2, 0.1)
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, subject.size || 1, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, subject.size || 1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, subject.size || 1, 0.1)
      }
    }

    // Rotate rings if present
    if (ringRef.current && subject.rings) {
      ringRef.current.rotation.x = Math.PI / 3
      ringRef.current.rotation.z += 0.001
    }

    // Rotate clouds if present
    if (cloudsRef.current && subject.atmosphere) {
      cloudsRef.current.rotation.y += 0.001
    }
  })

  return (
    <group position={position}>
      {/* Planet */}
      <mesh ref={meshRef} onClick={handlePlanetClick} onPointerOver={onHover} onPointerOut={onHoverEnd}>
        <sphereGeometry args={[1, 64, 64]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            normalMap={normalMap}
            bumpScale={planetProps.bumpScale}
            metalness={planetProps.metalness}
            roughness={planetProps.roughness}
          />
        ) : (
          <meshStandardMaterial
            color={subject.color}
            normalMap={normalMap}
            bumpScale={planetProps.bumpScale}
            metalness={planetProps.metalness}
            roughness={planetProps.roughness}
          />
        )}

        {/* Atmosphere glow effect */}
        {subject.atmosphere && (
          <>
            <Sphere args={[1.05, 32, 32]}>
              <meshStandardMaterial color={subject.color} transparent opacity={0.1} side={THREE.BackSide} />
            </Sphere>

            {/* Cloud layer */}
            <mesh ref={cloudsRef}>
              <sphereGeometry args={[1.03, 32, 32]} />
              <meshStandardMaterial color="white" transparent opacity={planetProps.cloudOpacity} map={cloudTexture} />
            </mesh>
          </>
        )}
      </mesh>

      {/* Rings for planets like Saturn */}
      {subject.rings && (
        <mesh ref={ringRef}>
          <ringGeometry args={[1.5, 2.5, 64]} />
          <meshStandardMaterial color={subject.color} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Moons */}
      {subject.moons &&
        Array.from({ length: subject.moons }).map((_, index) => (
          <mesh
            key={`moon-${index}`}
            position={[
              Math.cos(index * ((Math.PI * 2) / subject.moons!)) * 2,
              Math.sin(index * 0.5) * 0.5,
              Math.sin(index * ((Math.PI * 2) / subject.moons!)) * 2,
            ]}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#aaa" />
          </mesh>
        ))}

      {/* Label - show on hover or always on mobile */}
      {(isHovered || showLabel) && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-center whitespace-nowrap max-w-[120px]">
            <p className="font-bold text-sm md:text-base">{subject.name}</p>
            <p className="text-[10px] md:text-xs text-gray-300">Click to explore</p>
          </div>
        </Html>
      )}

      {/* Popup with subject intro */}
      {showPopup && (
        <Html position={[0, 0, 0]} center>
          <div className="bg-black/90 text-white px-4 py-3 rounded-xl text-center whitespace-nowrap animate-bounce-slow max-w-[200px]">
            <p className="font-bold text-sm md:text-lg">{subject.name}</p>
            <p className="text-xs md:text-sm text-gray-300 mt-1">{planetProps.description}</p>
          </div>
        </Html>
      )}
    </group>
  )
}
