"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Html } from "@react-three/drei"
import { useRouter } from "next/navigation"
import { subjects } from "@/lib/data"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"

export function EnchantedKingdom() {
  const isMobile = useMobile()

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 15, 30], fov: 60 }}>
        <color attach="background" args={["#050A30"]} />
        <fog attach="fog" args={["#050A30", 20, 80]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 10, 5]} intensity={0.3} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <KingdomScene showLabels={isMobile} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={15}
          maxDistance={50}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>

      {/* Mobile subject labels overlay */}
      {isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full flex items-center justify-center">
            {subjects.map((subject, index) => {
              // Calculate position in a circle for the labels
              const angle = (index * (Math.PI / 4)) % (2 * Math.PI)
              const radius = 40 // Percentage from center
              const left = 50 + Math.sin(angle) * radius
              const top = 50 + Math.cos(angle) * radius

              return (
                <div
                  key={subject.id}
                  className="absolute text-center pointer-events-auto"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                    style={{
                      backgroundColor: `${subject.color}99`,
                      fontSize: "0.7rem",
                    }}
                  >
                    {subject.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function KingdomScene({ showLabels = false }) {
  const router = useRouter()
  const [hoveredTower, setHoveredTower] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState<string | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003
    }
  })

  const handleTowerClick = (subjectId: string) => {
    // Show popup briefly before navigating
    setShowPopup(subjectId)
    setTimeout(() => {
      setShowPopup(null)
      router.push(`/subject/${subjectId}`)
    }, 1500)
  }

  // Subject descriptions
  const getSubjectDescription = (subjectId: string) => {
    switch (subjectId) {
      case "english":
        return "Explore the magical world of words and stories!"
      case "maths":
        return "Discover the enchanted realm of numbers and patterns!"
      case "science":
        return "Uncover the mystical secrets of nature and the universe!"
      case "history":
        return "Journey through the ancient tales of our world!"
      case "arts":
        return "Express your creativity in this magical realm!"
      case "hindi":
        return "Learn the beautiful language of Hindi in this enchanted tower!"
      case "technology":
        return "Master the arcane arts of technology and coding!"
      case "reasoning":
        return "Sharpen your mind with magical puzzles and riddles!"
      default:
        return "Discover the wonders of this magical subject!"
    }
  }

  return (
    <group ref={groupRef}>
      {/* Castle base */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#000B49" />
      </mesh>

      {/* Central castle */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[5, 6, 4, 8]} />
        <meshStandardMaterial color="#0C1E7F" />
      </mesh>

      {/* Castle top */}
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[5, 3, 8]} />
        <meshStandardMaterial color="#3D2C8D" />
      </mesh>

      {/* Moon */}
      <mesh position={[-20, 20, -20]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color="#E6E6FA" emissive="#E6E6FA" emissiveIntensity={0.2} />
      </mesh>

      {/* Towers arranged in a circle */}
      {subjects.map((subject, index) => {
        const angle = (index * (Math.PI / 4)) % (2 * Math.PI)
        const radius = 10
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        return (
          <Tower
            key={subject.id}
            subject={subject}
            position={[x, -2, z]}
            onClick={() => handleTowerClick(subject.id)}
            onHover={() => setHoveredTower(subject.id)}
            onHoverEnd={() => setHoveredTower(null)}
            isHovered={hoveredTower === subject.id}
            showLabel={showLabels}
            showPopup={showPopup === subject.id}
            description={getSubjectDescription(subject.id)}
          />
        )
      })}

      {/* Floating lanterns */}
      {Array.from({ length: 20 }).map((_, index) => {
        const angle = (index / 20) * Math.PI * 2
        const radius = 12 + Math.sin(index * 0.5) * 3
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        const y = 2 + Math.sin(index * 0.7) * 2

        return <Lantern key={`lantern-${index}`} position={[x, y, z]} color={index % 2 === 0 ? "#FFD700" : "#FF6B6B"} />
      })}
    </group>
  )
}

function Tower({ subject, position, onClick, onHover, onHoverEnd, isHovered, showLabel, showPopup, description }: any) {
  const towerRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (towerRef.current) {
      // Tower animation when hovered
      if (isHovered) {
        towerRef.current.scale.y = THREE.MathUtils.lerp(towerRef.current.scale.y, 1.1, 0.1)
      } else {
        towerRef.current.scale.y = THREE.MathUtils.lerp(towerRef.current.scale.y, 1, 0.1)
      }
    }
  })

  return (
    <group ref={towerRef} position={position} onClick={onClick} onPointerOver={onHover} onPointerOut={onHoverEnd}>
      {/* Tower base */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1, 1.5, 2, 8]} />
        <meshStandardMaterial color="#1C1C6B" />
      </mesh>

      {/* Tower body */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 3, 8]} />
        <meshStandardMaterial color="#1F1F7A" />
      </mesh>

      {/* Tower top */}
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color={subject.color} />
      </mesh>

      {/* Tower window */}
      <mesh position={[0, 3.5, 0.9]}>
        <boxGeometry args={[0.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>

      {/* Tower light */}
      <pointLight position={[0, 6.5, 0]} intensity={isHovered ? 1 : 0.3} distance={5} decay={2} color={subject.color} />

      {/* Drawbridge animation when hovered */}
      <mesh position={[0, 0.2, 1]} rotation={[isHovered ? -Math.PI / 3 : -Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#6A6A8E" />
      </mesh>

      {/* Info tooltip - show on hover or always on mobile */}
      {(isHovered || showLabel) && (
        <Html position={[0, 8, 0]} center>
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-center whitespace-nowrap max-w-[120px]">
            <p className="font-bold text-sm md:text-base">{subject.name}</p>
            <p className="text-[10px] md:text-xs text-gray-300">Enter Tower</p>
          </div>
        </Html>
      )}

      {/* Popup with subject intro */}
      {showPopup && (
        <Html position={[0, 4, 0]} center>
          <div className="bg-black/90 text-white px-4 py-3 rounded-xl text-center whitespace-nowrap animate-bounce-slow max-w-[200px]">
            <p className="font-bold text-sm md:text-lg">{subject.name}</p>
            <p className="text-xs md:text-sm text-gray-300 mt-1">{description}</p>
          </div>
        </Html>
      )}

      {/* Flying scroll when hovered */}
      {isHovered && (
        <mesh position={[0, 7, 0]} rotation={[0, Date.now() * 0.001, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
          <meshStandardMaterial color="#F5F5DC" />
        </mesh>
      )}
    </group>
  )
}

function Lantern({ position, color }: any) {
  const lanternRef = useRef<THREE.Group>(null)
  const initialY = position[1]

  useFrame(() => {
    if (lanternRef.current) {
      // Floating animation
      lanternRef.current.position.y = initialY + Math.sin(Date.now() * 0.001 + position[0]) * 0.3

      // Slight rotation
      lanternRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={lanternRef} position={position}>
      {/* Lantern body */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      {/* Lantern light */}
      <pointLight intensity={0.5} distance={3} decay={2} color={color} />
    </group>
  )
}
