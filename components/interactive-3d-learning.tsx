"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, Stars } from "@react-three/drei"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as THREE from "three"

export function Interactive3DLearning() {
  const [activeTab, setActiveTab] = useState("solar-system")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>3D Interactive Learning</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="solar-system" onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none px-6 pt-2">
            <TabsTrigger value="solar-system">Solar System</TabsTrigger>
            <TabsTrigger value="atom">Atomic Structure</TabsTrigger>
            <TabsTrigger value="cell">Cell Biology</TabsTrigger>
          </TabsList>

          <div className="h-[500px] w-full">
            <TabsContent value="solar-system" className="h-full m-0">
              <SolarSystemModel />
            </TabsContent>

            <TabsContent value="atom" className="h-full m-0">
              <AtomModel />
            </TabsContent>

            <TabsContent value="cell" className="h-full m-0">
              <CellModel />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Solar System Model
function SolarSystemModel() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  const planets = [
    {
      id: "mercury",
      name: "Mercury",
      distance: 4,
      size: 0.4,
      color: "#A9A9A9",
      speed: 0.01,
      info: "Closest planet to the Sun with extreme temperature variations.",
    },
    {
      id: "venus",
      name: "Venus",
      distance: 7,
      size: 0.9,
      color: "#E6E6FA",
      speed: 0.007,
      info: "Similar in size to Earth but with a toxic atmosphere.",
    },
    {
      id: "earth",
      name: "Earth",
      distance: 10,
      size: 1,
      color: "#1E90FF",
      speed: 0.005,
      info: "Our home planet, the only known world with liquid water on its surface.",
    },
    {
      id: "mars",
      name: "Mars",
      distance: 15,
      size: 0.5,
      color: "#CD5C5C",
      speed: 0.004,
      info: "The Red Planet with polar ice caps and the largest volcano in the solar system.",
    },
    {
      id: "jupiter",
      name: "Jupiter",
      distance: 50,
      size: 11,
      color: "#F4A460",
      speed: 0.002,
      info: "The largest planet in our solar system with a Great Red Spot.",
    },
    {
      id: "saturn",
      name: "Saturn",
      distance: 90,
      size: 9,
      color: "#FFD700",
      speed: 0.0015,
      info: "Known for its beautiful ring system made mostly of ice particles.",
    },
    {
      id: "uranus",
      name: "Uranus",
      distance: 180,
      size: 4,
      color: "#ADD8E6",
      speed: 0.001,
      info: "An ice giant that rotates on its side, unlike other planets.",
    },
    {
      id: "neptune",
      name: "Neptune",
      distance: 280,
      size: 3.9,
      color: "#4169E1",
      speed: 0.0008,
      info: "The windiest planet with the strongest storms in the solar system.",
    },
  ]

  return (
    <div className="relative h-full">
      <Canvas camera={{ position: [0, 30, 100], fov: 60 }}>
        <color attach="background" args={["#000010"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} distance={300} decay={0} color="#FDB813" />
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Sun */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[3, 32, 32]} />
          <meshBasicMaterial color="#FDB813" />
        </mesh>

        {/* Planets */}
        {planets.map((planet) => (
          <Planet
            key={planet.id}
            planet={planet}
            isSelected={selectedPlanet === planet.id}
            onSelect={() => setSelectedPlanet(planet.id === selectedPlanet ? null : planet.id)}
          />
        ))}

        <OrbitControls enableZoom={true} enablePan={false} minDistance={20} maxDistance={400} />
      </Canvas>

      {selectedPlanet && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <h3 className="text-lg font-bold mb-1">{planets.find((p) => p.id === selectedPlanet)?.name}</h3>
          <p className="text-sm text-gray-300">{planets.find((p) => p.id === selectedPlanet)?.info}</p>
        </motion.div>
      )}
    </div>
  )
}

function Planet({ planet, isSelected, onSelect }: any) {
  const ref = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Line>(null)
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2)

  useFrame(() => {
    if (ref.current) {
      // Update planet position
      setAngle((prev) => prev + planet.speed)
      const x = Math.cos(angle) * planet.distance
      const z = Math.sin(angle) * planet.distance
      ref.current.position.set(x, 0, z)

      // Scale effect when selected
      if (isSelected) {
        ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, 1.5, 0.1)
        ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, 1.5, 0.1)
        ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, 1.5, 0.1)
      } else {
        ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, 1, 0.1)
        ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, 1, 0.1)
        ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, 1, 0.1)
      }
    }
  })

  // Create orbit path
  const orbitPoints = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    orbitPoints.push(new THREE.Vector3(Math.cos(angle) * planet.distance, 0, Math.sin(angle) * planet.distance))
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)

  return (
    <>
      {/* Orbit path */}
      <line ref={orbitRef} geometry={orbitGeometry}>
        <lineBasicMaterial attach="material" color="#333" opacity={0.5} transparent />
      </line>

      {/* Planet */}
      <mesh ref={ref} onClick={onSelect} scale={[planet.size, planet.size, planet.size]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={planet.color} />

        {/* Planet name */}
        {isSelected && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">{planet.name}</div>
          </Html>
        )}
      </mesh>
    </>
  )
}

// Atom Model
function AtomModel() {
  const [showElectrons, setShowElectrons] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [atomType, setAtomType] = useState("hydrogen")

  const atoms = {
    hydrogen: {
      name: "Hydrogen",
      protons: 1,
      neutrons: 0,
      electrons: 1,
      shells: [1],
      color: "#00BFFF",
    },
    helium: {
      name: "Helium",
      protons: 2,
      neutrons: 2,
      electrons: 2,
      shells: [2],
      color: "#FFD700",
    },
    lithium: {
      name: "Lithium",
      protons: 3,
      neutrons: 4,
      electrons: 3,
      shells: [2, 1],
      color: "#FF6347",
    },
    carbon: {
      name: "Carbon",
      protons: 6,
      neutrons: 6,
      electrons: 6,
      shells: [2, 4],
      color: "#808080",
    },
    oxygen: {
      name: "Oxygen",
      protons: 8,
      neutrons: 8,
      electrons: 8,
      shells: [2, 6],
      color: "#FF0000",
    },
  }

  const selectedAtom = atoms[atomType as keyof typeof atoms]

  return (
    <div className="relative h-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={["#000010"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* Nucleus */}
        <Nucleus protons={selectedAtom.protons} neutrons={selectedAtom.neutrons} />

        {/* Electron shells */}
        {showElectrons &&
          selectedAtom.shells.map((electronCount, shellIndex) => (
            <ElectronShell
              key={shellIndex}
              shellIndex={shellIndex}
              electronCount={electronCount}
              showLabels={showLabels}
              color={selectedAtom.color}
            />
          ))}

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">{selectedAtom.name} Atom</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">Protons</div>
            <div className="font-bold">{selectedAtom.protons}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Neutrons</div>
            <div className="font-bold">{selectedAtom.neutrons}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Electrons</div>
            <div className="font-bold">{selectedAtom.electrons}</div>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <select
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
              value={atomType}
              onChange={(e) => setAtomType(e.target.value)}
            >
              <option value="hydrogen">Hydrogen</option>
              <option value="helium">Helium</option>
              <option value="lithium">Lithium</option>
              <option value="carbon">Carbon</option>
              <option value="oxygen">Oxygen</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowElectrons(!showElectrons)}>
              {showElectrons ? "Hide" : "Show"} Electrons
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowLabels(!showLabels)}>
              {showLabels ? "Hide" : "Show"} Labels
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01
    }
  })

  // Create positions for protons and neutrons
  const particlePositions = []
  const totalParticles = protons + neutrons

  for (let i = 0; i < totalParticles; i++) {
    // Arrange particles in a sphere-like structure
    const phi = Math.acos(-1 + (2 * i) / totalParticles)
    const theta = Math.sqrt(totalParticles * Math.PI) * phi

    particlePositions.push({
      x: 0.8 * Math.cos(theta) * Math.sin(phi),
      y: 0.8 * Math.sin(theta) * Math.sin(phi),
      z: 0.8 * Math.cos(phi),
      isProton: i < protons,
    })
  }

  return (
    <group ref={group}>
      {particlePositions.map((pos, index) => (
        <mesh key={index} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={pos.isProton ? "#FF4500" : "#4169E1"} />
        </mesh>
      ))}
    </group>
  )
}

function ElectronShell({
  shellIndex,
  electronCount,
  showLabels,
  color,
}: { shellIndex: number; electronCount: number; showLabels: boolean; color: string }) {
  const shellRadius = 2 + shellIndex * 2
  const electronRefs = useRef<THREE.Mesh[]>([])
  const shellRef = useRef<THREE.Line>(null)

  // Create orbit path
  const orbitPoints = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    orbitPoints.push(new THREE.Vector3(Math.cos(angle) * shellRadius, Math.sin(angle) * shellRadius, 0))
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)

  useFrame(({ clock }) => {
    // Rotate shell
    if (shellRef.current) {
      shellRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
      shellRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1
    }

    // Move electrons
    electronRefs.current.forEach((electron, i) => {
      if (electron) {
        const angle = (i / electronCount) * Math.PI * 2 + clock.getElapsedTime() * (1 - shellIndex * 0.2)
        electron.position.x = Math.cos(angle) * shellRadius
        electron.position.y = Math.sin(angle) * shellRadius
        electron.position.z = 0
      }
    })
  })

  return (
    <group>
      {/* Orbit path */}
      <line ref={shellRef} geometry={orbitGeometry}>
        <lineBasicMaterial attach="material" color={color} opacity={0.5} transparent />
      </line>

      {/* Electrons */}
      {Array.from({ length: electronCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) electronRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={color} />

          {showLabels && i === 0 && (
            <Html position={[0, 0.5, 0]} center>
              <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                Shell {shellIndex + 1}
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  )
}

// Cell Model
function CellModel() {
  const [showLabels, setShowLabels] = useState(true)
  const [cellType, setCellType] = useState("animal")

  return (
    <div className="relative h-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={["#000010"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {cellType === "animal" ? <AnimalCell showLabels={showLabels} /> : <PlantCell showLabels={showLabels} />}

        <OrbitControls enableZoom={true} enablePan={false} minDistance={5} maxDistance={20} />
      </Canvas>

      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg">
        <div className="flex flex-col gap-2">
          <div>
            <select
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-full"
              value={cellType}
              onChange={(e) => setCellType(e.target.value)}
            >
              <option value="animal">Animal Cell</option>
              <option value="plant">Plant Cell</option>
            </select>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowLabels(!showLabels)}>
            {showLabels ? "Hide" : "Show"} Labels
          </Button>
        </div>
      </div>
    </div>
  )
}

function AnimalCell({ showLabels }: { showLabels: boolean }) {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* Cell membrane */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
      </mesh>

      {/* Nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#4682B4" />

        {showLabels && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Nucleus</div>
          </Html>
        )}
      </mesh>

      {/* Mitochondria */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 3
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <mesh key={`mito-${i}`} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <capsuleGeometry args={[0.3, 1, 8, 16]} />
            <meshStandardMaterial color="#FF6347" />

            {showLabels && i === 0 && (
              <Html position={[0, 0.8, 0]} center>
                <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Mitochondrion</div>
              </Html>
            )}
          </mesh>
        )
      })}

      {/* Endoplasmic Reticulum */}
      <mesh position={[2, -1, 1]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1, 0.2, 16, 100, Math.PI * 1.5]} />
        <meshStandardMaterial color="#9370DB" />

        {showLabels && (
          <Html position={[0, 0.5, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              Endoplasmic Reticulum
            </div>
          </Html>
        )}
      </mesh>

      {/* Golgi Apparatus */}
      <group position={[-2, 1, 2]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`golgi-${i}`} position={[0, i * 0.2 - 0.4, 0]}>
            <boxGeometry args={[1.5, 0.1, 0.8]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        ))}

        {showLabels && (
          <Html position={[0, 0.8, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Golgi Apparatus</div>
          </Html>
        )}
      </group>

      {/* Lysosomes */}
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i / 3) * Math.PI * 2
        const radius = 2.5
        const x = Math.cos(angle + Math.PI / 3) * radius
        const z = Math.sin(angle + Math.PI / 3) * radius

        return (
          <mesh key={`lyso-${i}`} position={[x, -1.5, z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#8A2BE2" />

            {showLabels && i === 0 && (
              <Html position={[0, 0.8, 0]} center>
                <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Lysosome</div>
              </Html>
            )}
          </mesh>
        )
      })}
    </group>
  )
}

function PlantCell({ showLabels }: { showLabels: boolean }) {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* Cell Wall */}
      <mesh>
        <boxGeometry args={[10, 10, 10]} />
        <meshStandardMaterial color="#8B4513" transparent opacity={0.3} />
      </mesh>

      {/* Cell Membrane */}
      <mesh>
        <boxGeometry args={[9.5, 9.5, 9.5]} />
        <meshStandardMaterial color="#90EE90" transparent opacity={0.5} />
      </mesh>

      {/* Nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#4682B4" />

        {showLabels && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Nucleus</div>
          </Html>
        )}
      </mesh>

      {/* Chloroplasts */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 3.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <mesh key={`chloro-${i}`} position={[x, 1, z]} rotation={[0, angle, 0]}>
            <ellipsoidGeometry args={[0.8, 0.4, 0.4, 16, 16]} />
            <meshStandardMaterial color="#006400" />

            {showLabels && i === 0 && (
              <Html position={[0, 0.8, 0]} center>
                <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Chloroplast</div>
              </Html>
            )}
          </mesh>
        )
      })}

      {/* Central Vacuole */}
      <mesh position={[0, -2, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#ADD8E6" transparent opacity={0.7} />

        {showLabels && (
          <Html position={[0, 0, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Central Vacuole</div>
          </Html>
        )}
      </mesh>

      {/* Mitochondria */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        const radius = 3
        const x = Math.cos(angle + Math.PI / 4) * radius
        const z = Math.sin(angle + Math.PI / 4) * radius

        return (
          <mesh key={`mito-${i}`} position={[x, 2, z]} rotation={[0, angle, 0]}>
            <capsuleGeometry args={[0.3, 1, 8, 16]} />
            <meshStandardMaterial color="#FF6347" />

            {showLabels && i === 0 && (
              <Html position={[0, 0.8, 0]} center>
                <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Mitochondrion</div>
              </Html>
            )}
          </mesh>
        )
      })}
    </group>
  )
}
