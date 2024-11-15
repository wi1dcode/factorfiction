import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { NextUIProvider } from "@nextui-org/react"
import { UserContextProvider } from "./services/userContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <NextUIProvider>
        <main className="dark min-h-screen text-foreground bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          <App />
        </main>
      </NextUIProvider>
    </UserContextProvider>
  </React.StrictMode>
)
