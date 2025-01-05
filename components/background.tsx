"use client";
export default function Background() {
  return (
    <div className="absolute inset-0 -z-[9000] min-h-screen">
      <div className="animate-floating-cube1 absolute left-20 top-20 h-20 w-20 rounded-md bg-black/40 blur-md"/>
      <div className="animate-floating-cube2 absolute right-16 top-1/3 h-16 w-16 rounded-md hover:scale-150 bg-red-400"/>
      <div className="animate-floating-cube3 blur-3xl absolute bottom-16 left-1/4 h-24 w-24 rounded-full bg-yellow-400"/>
      <div className="animate-floating-cube4 fixed bottom-10 right-1/4 h-32 w-[10rem] rounded-md bg-green-400 blur-3xl fade-in-30"/>
      <div className="animate-floating-cube6 absolute right-[6%] top-1/2 h-16 w-16 blur-sm rounded-md bg-purple-400"/>
      <div className="animate-floating-cube7 absolute left-[6%] top-1/2 h-16 w-16 rounded-md bg-[#2bb6b3] blur-xl fade-in-50"/>
    </div>
  );
}
