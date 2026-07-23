import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  VolumeSlider,
  ToggleSwitch,
  ConfirmationDialog,
} from '@/components/ui'
import { useSettings } from '@/hooks/useSettings'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

interface OptionItem<T extends string> {
  value: T
  label: string
}

function WoodDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: ReadonlyArray<OptionItem<T>>
  onChange: (val: T) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex flex-col gap-1.5 pt-1" ref={containerRef}>
      <span className="text-xs font-bold text-[#ffe49e]">{label}</span>

      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-[#78431e] bg-[#2a1307] px-3.5 py-2 text-xs font-black text-[#fff3cd] shadow-inner outline-none transition-all hover:border-[#fcd34d] cursor-pointer"
      >
        <span>{selectedOption.label}</span>
        <span className={`text-[10px] text-[#fcd34d] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* 3D Wood Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-40 mt-1 flex flex-col gap-1 rounded-2xl border-2 border-[#78431e] bg-[#3a1d0d] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.85)] backdrop-blur-md"
          >
            {options.map((opt) => {
              const isSelected = value === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-sm'
                      : 'text-[#ffe49e] hover:bg-[#4a2713]/80 hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="text-sm font-black">✓</span>}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SettingsPage() {
  useDocumentTitle('Settings')
  const { settings, updateSetting, resetSettings } = useSettings()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const navigate = useNavigate()

  const handleReset = async () => {
    await resetSettings()
  }

  const colorBlindOptions = [
    { value: 'none', label: 'None (Default)' },
    { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
  ] as const

  return (
    <div className="simon-home-screen simon-settings-screen select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card relative flex flex-col items-center justify-center p-4 overflow-y-auto"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />

        {/* ── 3D Wood Settings Plaque Box ── */}
        <div className="relative z-10 my-auto flex w-full max-w-[440px] flex-col gap-3.5 rounded-[26px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-5 sm:p-6 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)] backdrop-blur-md">
          
          {/* Header Bar inside Plaque */}
          <div className="flex items-center justify-between pb-2 border-b border-[#8a4e22]/50">
            <button
              onClick={() => navigate('/')}
              type="button"
              aria-label="Return home"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-lg font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform active:scale-95 cursor-pointer outline-none"
            >
              ⌂
            </button>
            <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-5 py-1 text-xs font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408]">
              GAME SETTINGS
            </div>
            <div className="w-10" />
          </div>

          {/* Group 1: Volume Controls */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#ffe49e]">
              🔊 Audio & Sound Effects
            </span>
            <VolumeSlider
              label="Sound Effects"
              onChange={(val) => updateSetting({ soundVolume: val })}
              value={settings.soundVolume}
            />
            <VolumeSlider
              label="Background Music"
              onChange={(val) => updateSetting({ musicVolume: val })}
              value={settings.musicVolume}
            />
          </div>

          {/* Group 2: Animation & Speed */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#ffe49e]">
              ⚡ Animation Speed
            </span>
            <div className="flex rounded-xl border border-[#5a341a] bg-[#2a1307] p-1">
              {(['slow', 'normal', 'fast'] as const).map((speed) => {
                const isActive = settings.animationSpeed === speed
                return (
                  <button
                    key={speed}
                    onClick={() => updateSetting({ animationSpeed: speed })}
                    type="button"
                    className={`flex-1 rounded-lg py-1.5 text-center text-xs font-black uppercase tracking-wide transition-all outline-none cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                        : 'text-[#ffe49e]/70 hover:text-[#ffe49e]'
                    }`}
                  >
                    {speed}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Group 3: Accessibility Customization */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#ffe49e]">
              👁️ Accessibility
            </span>
            <ToggleSwitch
              checked={settings.highContrast}
              label="High Contrast Mode"
              onChange={(checked) => updateSetting({ highContrast: checked })}
            />
            <ToggleSwitch
              checked={settings.buttonSymbols}
              label="Optional Button Symbols"
              onChange={(checked) => updateSetting({ buttonSymbols: checked })}
            />
            <ToggleSwitch
              checked={settings.reduceMotion}
              label="Reduced Motion Mode"
              onChange={(checked) => updateSetting({ reduceMotion: checked })}
            />

            {/* Custom 3D Wood Color Blind Dropdown */}
            <WoodDropdown
              label="Color Blind Mode"
              options={colorBlindOptions}
              value={settings.colorBlindMode}
              onChange={(val) => updateSetting({ colorBlindMode: val })}
            />
          </div>

          {/* Reset Action Button */}
          <div className="mt-1 flex justify-center">
            <button
              onClick={() => setIsResetOpen(true)}
              type="button"
              className="w-full rounded-xl border border-[#78281a] bg-gradient-to-b from-[#c93b2b] to-[#801b10] py-2.5 text-xs font-black uppercase tracking-widest text-[#ffe49e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_0_#4a0d06] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Reset All Preferences
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation modal before settings reset */}
      <ConfirmationDialog
        confirmLabel="Reset All"
        isDanger
        isOpen={isResetOpen}
        message="Are you sure you want to revert all system parameters to factory defaults?"
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Preferences"
      />
    </div>
  )
}
