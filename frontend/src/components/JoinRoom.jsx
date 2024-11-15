import { Button } from "@nextui-org/react"
import React, { useState, useRef, useEffect } from "react"

const JoinRoom = () => {
  const length = 5
  const [values, setValues] = useState(Array(length).fill(""))
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0].focus()
  }, [])

  const updateValue = (index, value) => {
    const newValues = [...values]
    newValues[index] = value.match(/\d/g) ? value : ""
    setValues(newValues)

    if (index < length - 1 && value) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pasteData = event.clipboardData.getData("text")
    const numbers = pasteData
      .split("")
      .filter((char) => /\d/.test(char))
      .slice(0, length)
    numbers.forEach((num, index) => {
      inputsRef.current[index].value = num
      updateValue(index, num)
    })
  }

  const focusPrevious = (index) => {
    if (index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  return (
    <div className="relative mx-auto max-w-md rounded-lg p-4 flex flex-col items-center">
      <label
        htmlFor="enter-pin"
        className="block text-3xl text-white font-extrabold text-center"
      >
        Enter PIN
      </label>
      <p className="text-sm cursor-pointer font-bold opacity-50 block text-center mb-2">
        or click to paste
      </p>
      <form
        id="enter-pin"
        className="flex flex-row flex-wrap justify-center space-x-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            onInput={(e) => updateValue(index, e.target.value)}
            onKeyDown={(e) =>
              e.key === "Backspace" && !e.target.value && focusPrevious(index)
            }
            ref={(el) => (inputsRef.current[index] = el)}
            className="w-14 max-md:w-12 max-sm:w-10 mb-4 rounded border-2 border-gray-200 focus:outline-indigo-500 bg-transparent p-3 text-center appearance-none"
            type="text"
            maxLength="1"
            onPaste={handlePaste}
          />
        ))}
      </form>
      <Button
        className="text-2xl text-white bg-indigo-500/50 font-extrabold px-6 py-3"
        // if values length not 5 then isDisabled
      >
        JOIN
      </Button>
    </div>
  )
}

export default JoinRoom
