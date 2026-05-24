export function GridBackdrop() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none select-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-noise opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute top-[35%] right-[5%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-primary/4 rounded-full blur-[120px]" />
    </div>
  )
}
