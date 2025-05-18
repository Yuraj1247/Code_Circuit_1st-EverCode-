"use client"

import { useState } from "react"
import { useLearnverseTheme, themeDetails, type Theme, type ThemeFeature } from "@/contexts/theme-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ThemeSelector() {
  const { theme, setTheme } = useLearnverseTheme()
  const [selectedThemeForDetails, setSelectedThemeForDetails] = useState<Theme | null>(null)

  const themes: Theme[] = ["solar", "kingdom", "terminal"]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((themeId) => {
          const themeInfo = themeDetails[themeId]
          const isSelected = theme === themeId

          return (
            <motion.div key={themeId} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={`cursor-pointer h-full overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? `border-2 border-${themeInfo.primaryColor}-500 shadow-lg shadow-${themeInfo.primaryColor}-500/20`
                    : "border-gray-800 hover:border-gray-700"
                }`}
                onClick={() => setTheme(themeId)}
              >
                <div className={`h-40 bg-gradient-to-br ${themeInfo.gradientFrom} ${themeInfo.gradientTo} relative`}>
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-lg">
                      <Check className="h-4 w-4 text-black" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{themeInfo.icon}</span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    {themeInfo.name}
                    {isSelected && (
                      <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
                    )}
                  </CardTitle>
                  <CardDescription>{themeInfo.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {themeInfo.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start">
                        <span className="mr-2">{feature.icon}</span>
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedThemeForDetails(themeId)
                    }}
                  >
                    <Info className="h-4 w-4 mr-1" /> Details
                  </Button>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`${
                      isSelected ? `bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}` : ""
                    }`}
                  >
                    {isSelected ? "Current Theme" : "Select Theme"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedThemeForDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedThemeForDetails(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2 text-3xl">{themeDetails[selectedThemeForDetails].icon}</span>
                  {themeDetails[selectedThemeForDetails].name} Features
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedThemeForDetails(null)}>
                  <Check className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <p className="text-gray-400 mb-6">{themeDetails[selectedThemeForDetails].description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {themeDetails[selectedThemeForDetails].features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} />
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    className={`bg-gradient-to-r ${themeDetails[selectedThemeForDetails].gradientFrom} ${themeDetails[selectedThemeForDetails].gradientTo}`}
                    onClick={() => {
                      setTheme(selectedThemeForDetails)
                      setSelectedThemeForDetails(null)
                    }}
                  >
                    Select This Theme
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {theme && (
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Theme Features</TabsTrigger>
            <TabsTrigger value="preview">Theme Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-2xl">{themeDetails[theme].icon}</span>
                  {themeDetails[theme].name} Features
                </CardTitle>
                <CardDescription>Explore all the amazing features of your selected theme</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themeDetails[theme].features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.name}</h3>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader>
                <CardTitle>Theme Preview</CardTitle>
                <CardDescription>See how your selected theme will look in the application</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden border border-gray-800 relative">
                  {theme === "solar" && (
                    <div className="absolute inset-0 bg-black">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-yellow-500 shadow-[0_0_60px_20px_rgba(255,215,0,0.4)]"></div>
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-gray-700 border-dashed animate-spin"
                        style={{ animationDuration: "20s" }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500"></div>
                      </div>
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-gray-700 border-dashed animate-spin"
                        style={{ animationDuration: "30s" }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500"></div>
                      </div>
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gray-700 border-dashed animate-spin"
                        style={{ animationDuration: "40s" }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  )}

                  {theme === "kingdom" && (
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-black">
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-64 h-48 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl">🏰</span>
                          <p className="text-indigo-300 mt-2">Enchanted Kingdom</p>
                        </div>
                      </div>
                      <div className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                        <span className="text-2xl">🔮</span>
                      </div>
                      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-lg border border-green-500/30 flex items-center justify-center">
                        <span className="text-2xl">🧙‍♂️</span>
                      </div>
                      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-lg border border-red-500/30 flex items-center justify-center">
                        <span className="text-2xl">🛡️</span>
                      </div>
                    </div>
                  )}

                  {theme === "terminal" && (
                    <div className="absolute inset-0 bg-black p-4 font-mono text-green-500 overflow-hidden">
                      <div className="animate-pulse absolute top-2 left-2 w-2 h-4 bg-green-500"></div>
                      <div className="mt-4">
                        <p className="typing-effect">$ LearnVerse OS v3.1.0 [Terminal Mode]</p>
                        <p className="typing-effect">$ Initializing system...</p>
                        <p className="typing-effect">$ Loading knowledge database...</p>
                        <p className="typing-effect">$ Connecting to neural network...</p>
                        <p className="typing-effect">$ System ready.</p>
                        <p className="typing-effect mt-4">$ Welcome to Terminal Hacker World</p>
                        <p className="typing-effect">$ Type 'help' for available commands</p>
                        <p className="mt-4 flex items-center">
                          <span className="text-green-500 mr-2">$</span>
                          <span className="animate-pulse">_</span>
                        </p>
                      </div>
                      <div className="absolute bottom-4 right-4 text-xs text-green-500/50">
                        <p>STATUS: CONNECTED</p>
                        <p>SECURITY: ENCRYPTED</p>
                        <p>MODE: LEARNING</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function FeatureCard({ feature, index }: { feature: ThemeFeature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
    >
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-xl">{feature.icon}</span>
        </div>
        <div>
          <h3 className="font-medium">{feature.name}</h3>
          <p className="text-sm text-gray-400">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
