import { useState } from 'react'
import {
  Container,
  Section,
  GlassCard,
  ThemeSelector,
  VolumeSlider,
  ToggleSwitch,
  AnimatedButton,
  ConfirmationDialog,
} from '@/components/ui'

import { useSettings } from '@/hooks/useSettings'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function SettingsPage() {
  useDocumentTitle('Settings')
  const { settings, updateSetting, resetSettings } = useSettings()
  const [isResetOpen, setIsResetOpen] = useState(false)

  const handleReset = async () => {
    await resetSettings()
  }

  return (
    <Container className="py-4">
      {/* Compact Minimal Header */}
      <div className="mb-6 flex flex-col gap-1 select-none">
        <span className="text-[10px] font-black tracking-widest text-[var(--color-accent)] uppercase">
          Preferences
        </span>
        <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
          App Settings
        </h1>
      </div>

      <Section spacing="compact" className="mx-auto max-w-md">
        <GlassCard
          className="flex max-h-[460px] scrollbar-none flex-col gap-5 overflow-y-auto shadow-xl"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Theme Settings Selector */}
          <ThemeSelector
            value={settings.themeMode}
            onChange={(theme) => updateSetting({ themeMode: theme })}
          />

          <hr className="border-white/[0.04]" />

          {/* Volume Sliders */}
          <div className="flex flex-col gap-2">
            <VolumeSlider
              label="Sound Effects Volume"
              onChange={(val) => updateSetting({ soundVolume: val })}
              value={settings.soundVolume}
            />
            <VolumeSlider
              label="Background Music"
              onChange={(val) => updateSetting({ musicVolume: val })}
              value={settings.musicVolume}
            />
          </div>

          <hr className="border-white/[0.04]" />

          {/* Playback speed selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
              Animation & Playback Speed
            </span>
            <div className="flex rounded-xl border border-white/[0.04] bg-white/[0.01] p-1">
              {(['slow', 'normal', 'fast'] as const).map((speed) => {
                const isActive = settings.animationSpeed === speed
                return (
                  <button
                    className={`flex-1 rounded-lg py-1.5 text-center text-xs font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus)] ${
                      isActive
                        ? 'bg-white/5 text-[var(--color-text-primary)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    key={speed}
                    onClick={() => updateSetting({ animationSpeed: speed })}
                    type="button"
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>

          <hr className="border-white/[0.04]" />

          {/* Accessibility Preferences Panel */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
              Accessibility Customization
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

            {/* Color Blind Selector Dropdown */}
            <div className="flex flex-col gap-1.5 py-2">
              <span className="text-xs font-medium text-[var(--color-text-primary)]">
                Color Blind Mode
              </span>
              <select
                className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-focus)]"
                onChange={(e) =>
                  updateSetting({
                    colorBlindMode: e.target.value as
                      'none' | 'protanopia' | 'deuteranopia' | 'tritanopia',
                  })
                }
                value={settings.colorBlindMode}
              >
                <option value="none">None (Default)</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              </select>
            </div>
          </div>

          <hr className="border-white/[0.04]" />

          {/* Reset to factory configurations button */}
          <div className="mt-2 text-left">
            <AnimatedButton onClick={() => setIsResetOpen(true)} variant="secondary">
              Reset Settings
            </AnimatedButton>
          </div>
        </GlassCard>
      </Section>

      {/* Confirmation modal before settings reset */}
      <ConfirmationDialog
        confirmLabel="Reset All"
        isDanger
        isOpen={isResetOpen}
        message="Are you sure you want to revert all system parameters to factory defaults? Your nickname and scores will not be deleted."
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Preferences"
      />
    </Container>
  )
}
