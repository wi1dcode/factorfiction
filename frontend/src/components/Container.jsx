import React from "react"

export default function Container({ children }) {
  return (
    <section className="max-md:w-full max-md:relative max-md:h-full md:w-[75%] md:h-[85vh] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 p-4 border-4 border-[rgba(29,29,27,.15)] md:rounded-lg shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,.15),0px_3px_0px_0px_rgba(255,255,255,0.15)]">
      {children}
    </section>
  )
}
