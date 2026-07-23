import { motion } from 'framer-motion'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

export function RouteLoadingState() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#0d160b] select-none"
      role="status"
      aria-label="Loading Syniq Game"
    >
      {/* 1. Forest Background Image with vignette blur */}
      <img
        src={simonForestBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
      />

      {/* 2. Soft Backdrop Blur & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1608]/85 via-[#0e200c]/50 to-[#060e05]/95 backdrop-blur-[6px]" />

      {/* 3. Central Steady 3D Wood Plaque Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 flex w-[88vw] max-w-[320px] flex-col items-center justify-center rounded-[24px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#54290c] px-5 py-6 text-center shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)]"
      >
        {/* Leaf Accent Badges */}
        <div aria-hidden="true" className="absolute -top-3 -left-3 h-9 w-9 rounded-tr-[70%] rounded-bl-[70%] border-2 border-[#1c380d] bg-gradient-to-br from-[#85c24e] to-[#38661b] shadow-md" />
        <div aria-hidden="true" className="absolute -top-3 -right-3 h-9 w-9 rounded-tl-[70%] rounded-br-[70%] border-2 border-[#1c380d] bg-gradient-to-bl from-[#85c24e] to-[#38661b] shadow-md" />

        {/* Top Wooden Ribbon Badge */}
        <div className="absolute -top-4 rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-4 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#2b1408]">
          <span>SYNIQ MEMORY</span>
        </div>

        {/* Steady 3D Wood Title SYNIQ */}
        <h1 className="my-3 flex items-center justify-center gap-1 font-black text-3xl tracking-widest uppercase" aria-label="SYNIQ">
          {"SYNIQ".split("").map((char, index) => (
            <span
              key={index}
              className="inline-block"
              style={{
                background: 'linear-gradient(180deg, #fff3cd 0%, #ffd075 35%, #e59336 65%, #b8621b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1.2px #482006',
                filter: 'drop-shadow(0 4px 6px rgba(15, 8, 2, 0.6))',
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Smooth 3D Animated Gemstone Spinner */}
        <div className="relative my-2 flex h-9 w-9 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="grid h-full w-full grid-cols-2 gap-1 rounded-full p-1 border-2 border-[#5a341a] bg-[#e8e0c5] shadow-[0_3px_0_#3d200e]"
          >
            <span className="rounded-full bg-gradient-to-b from-[#64cf4a] to-[#2a8216] border border-[#1c590d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
            <span className="rounded-full bg-gradient-to-b from-[#f85b5b] to-[#b91c1c] border border-[#7f1d1d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
            <span className="rounded-full bg-gradient-to-b from-[#38bdf8] to-[#0369a1] border border-[#0c4a6e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
            <span className="rounded-full bg-gradient-to-b from-[#fbbf24] to-[#b45309] border border-[#78350f] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
          </motion.div>
        </div>

        {/* Loading Bar Container */}
        <div className="mt-1.5 w-full px-2">
          <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-widest text-[#ffe49e] drop-shadow-[0_1px_2px_rgba(40,18,6,0.9)]">
            <span>Loading Game</span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Please wait...
            </motion.span>
          </div>

          {/* Animated 3D Wood & Gold Progress Bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#3a1d0d] p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
            <motion.div
              animate={{
                x: ['-100%', '0%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
              className="h-full w-full rounded-full bg-gradient-to-r from-[#e29741] via-[#fcd34d] to-[#c97020] shadow-[0_0_8px_rgba(252,211,77,0.8)]"
            />
          </div>
        </div>

        {/* Rating Stars */}
        <div className="mt-3 flex gap-1 text-[13px] text-[#fbbf24] drop-shadow-[0_2px_3px_rgba(20,10,2,0.8)]">
          <span>★</span><span>★</span><span className="opacity-40">★</span>
        </div>
      </motion.div>
    </div>
  )
}
