"use client"

import { useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Stars, OrbitControls } from "@react-three/drei"
import { useRouter } from "next/navigation"
import { subjects } from "@/lib/data"
import { EnhancedPlanet } from "./enhanced-planet"
import { useMobile } from "@/hooks/use-mobile"

export function GalaxyExplorer() {
  const router = useRouter()
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const controlsRef = useRef<any>(null)
  const isMobile = useMobile()

  const handlePlanetClick = (subjectId: string) => {
    router.push(`/subject/${subjectId}`)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 15, 30], fov: 60 }}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Sun at the center */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={0.6} />
        </mesh>

        {/* Planets */}
        {subjects.map((subject, index) => {
          // Calculate position in a circle around the sun
          const angle = (index / subjects.length) * Math.PI * 2
          const radius = 10 + index * 2 // Increasing radius for each planet
          const x = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius

          return (
            <EnhancedPlanet
              key={subject.id}
              subject={subject}
              position={[x, 0, z]}
              onClick={() => handlePlanetClick(subject.id)}
              onHover={() => setHoveredPlanet(subject.id)}
              onHoverEnd={() => setHoveredPlanet(null)}
              isHovered={hoveredPlanet === subject.id}
              showLabel={isMobile} // Always show labels on mobile
            />
          )
        })}

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={15}
          maxDistance={50}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Mobile subject labels overlay */}
      {isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full flex items-center justify-center">
            {subjects.map((subject, index) => {
              // Calculate position in a circle for the labels
              const angle = (index / subjects.length) * Math.PI * 2
              const radius = 40 + index * 5 // Percentage from center
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
