import React from "react"
import UsersSVG from "../assets/svg/UsersSVG"

function OpenRoom() {
  return (
    <article className="w-full bg-black/20 rounded-lg h-14 flex items-center justify-between p-2 px-4 cursor-pointer mb-2">
      <div>Room name</div>
      <div>#FD3V2D</div>
      <div className="flex items-center gap-2">
        4 / 10
        <UsersSVG />
      </div>
    </article>
  )
}

export default OpenRoom
