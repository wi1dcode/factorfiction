import React from "react"
import logo from "../assets/logo_variant.png"
import { Button } from "@nextui-org/react"
import LangSVG from "../assets/svg/LangSVG"
import ProfileSVG from "../assets/svg/ProfileSVG"
import { useNavigate, useLocation } from "react-router-dom"
import HomeSVG from "../assets/svg/HomeSVG"

function Header({ openLoginModal, openLangModal }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isHomePage = location.pathname === "/"

  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-x-2">
        {isHomePage ? (
          <Button
            isIconOnly
            onClick={openLangModal}
            radius="sm"
            aria-label="Language"
            size="lg"
            className="bg-black/20 border-2 border-white/60 text-lg"
          >
            <LangSVG />
          </Button>
        ) : (
          <Button
            isIconOnly
            radius="sm"
            aria-label="Home"
            size="lg"
            onClick={() => navigate("/")}
            className="bg-black/20 border-2 border-white/60 text-lg"
          >
            <HomeSVG />
          </Button>
        )}
      </div>
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src={logo} alt="logo" width="180" />
      </div>
      <Button
        isIconOnly
        aria-label="Profile"
        size="lg"
        radius="sm"
        onClick={openLoginModal}
        className="bg-black/20 border-2 border-white/60 text-lg"
      >
        <ProfileSVG />
      </Button>
    </div>
  )
}

export default Header
