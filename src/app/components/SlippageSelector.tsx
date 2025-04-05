'use client'

import { useState } from "react"

const PRESETS = [0.1, 0.5, 1]

const SlippageSelector = ({
  slippage,
  setSlippage,
}: {
  slippage: number
  setSlippage: (value: number) => void
}) => {
  const [custom, setCustom] = useState("")

  const handleCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustom(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) setSlippage(parsed)
  }

  return (
    <div className="mt-4">
      <div className="text-sm text-zinc-400 mb-1">Slippage Tolerance</div>
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSlippage(p)
              setCustom("")
            }}
            className={`px-3 py-1 rounded ${
              slippage === p ? "bg-pink-600 text-white" : "bg-zinc-700 text-white"
            }`}
          >
            {p}%
          </button>
        ))}
        <input
          className="w-18 px-2 py-1 rounded bg-zinc-800 text-white"
          placeholder="Custom"
          value={custom}
          onChange={handleCustom}
        />
      </div>
    </div>
  )
}

export default SlippageSelector
