import React from "react"
import TelegramSVG from "../assets/svg/TelegramSVG"
import DiscordSvg from "../assets/svg/DiscordSvg"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <div className="absolute left-0 bottom-2 flex justify-around w-full items-center max-md:flex-col-reverse max-md:justify-center">
      <ul className="flex gap-x-4 max-md:gap-x-2 max-sm:text-sm uppercase opacity-60 font-semibold max-md:justify-center">
        <Link to="#">
          <li>Как играть</li>
        </Link>
        <li className="cursor-default">|</li>
        <Link to="#">
          <li>Таблица лидеров</li>
        </Link>
        <li className="cursor-default">|</li>
        <Link to="#">
          <li>Связаться</li>
        </Link>
      </ul>
      <div className="opacity-60 font-semibold flex gap-x-4 max-md:hidden">
        <Link to="#">
          <TelegramSVG />
        </Link>
        <Link to="#">
          <DiscordSvg />
        </Link>
      </div>
    </div>
  )
}
