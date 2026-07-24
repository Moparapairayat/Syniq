const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative z-10 w-full max-w-[480px] mx-auto py-4 px-4 text-center text-xs text-[#a3b899] border-t border-[#3d4f2d]/30 select-none">
      <p className="font-medium tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
        <span>SYNIQ</span>
        <span>•</span>
        <span>Created by</span>
        <span className="font-bold text-[#fcd34d] drop-shadow-sm">
          Mopara Pair Ayat
        </span>
        <span>© {currentYear}</span>
      </p>
    </footer>
  )
}
