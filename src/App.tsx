import { useRef, useState, ChangeEvent } from "react"
import "./App.css"

import HanziWriter from "hanzi-writer"
import { Canvg } from "canvg"

const CopyRight = () => {
  return (
    <div className='copyright'>
      <p className='p-1'>
        © 2023 | Powered by{" "}
        <a className='a-1' href='https://i.jetsung.com' target='_black'>
          Jetsung
        </a>
      </p>
    </div>
  )
}

const App = () => {
  const [inputText, setInputText] = useState("")
  const [animate, setAnimate] = useState(false)
  const characterTargetRef = useRef<HTMLDivElement | null>(null)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setInputText(value)
  }

  const handleGenerate = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    mode: string
  ) => {
    event.preventDefault()
    if (!inputText) {
      return
    }
    // console.log(`current: ${mode}, ${inputText}`)
    const inputValue = inputText
    handleClearData()
    // console.log(inputValue)

    if (/^[\u4e00-\u9fa5]$/.test(inputValue[0])) {
      const writer = HanziWriter.create("character-target-div", inputValue[0], {
        charDataLoader: function (char, onComplete) {
          fetch("hanzi-writer-data/" + char + ".json").then(res => {
            res.json().then(data => {
              onComplete(data)
            })
          })
        },
        width: 100,
        height: 100,
        padding: 5,
        strokeAnimationSpeed: 1,
        radicalColor: "#ff0000",
      })

      // writer.showCharacter()
      setAnimate(false)

      // 直接生成
      if (mode == "submit") {
        writer.showCharacter().then(() => {
          generateDownloadSvg()
          setInputText(inputValue[0])
        })
      } else {
        // 生成动画
        writer.animateCharacter().then(() => {
          generateDownloadSvg()
          setInputText(inputValue[0])
        })
      }
    } else {
      setInputText("")
    }
  }

  const generateDownloadSvg = () => {
    if (!characterTargetRef?.current?.innerHTML) {
      return
    }
    let modifiedSvgText = characterTargetRef.current.innerHTML.replace(
      /clip-path="url\(&quot;(.*?)#(.*?)&quot;\)"/g,
      'clip-path="url(#$2)"'
    )
    // fix xmlns="http://www.w3.org/2000/svg"
    modifiedSvgText = modifiedSvgText.replace(
      "<svg",
      '<svg xmlns="http://www.w3.org/2000/svg"'
    )
    // console.log(modifiedSvgText)
    downloadSvg(modifiedSvgText)
  }

  const downloadSvg = (svgData: string) => {
    if (!characterTargetRef?.current?.innerHTML) {
      return
    }

    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const divContainer = document.createElement("div")
    divContainer.classList.add("download")

    const downloadSvgLink = document.createElement("a")
    downloadSvgLink.href = url
    downloadSvgLink.download = `${inputText}.svg`
    downloadSvgLink.textContent = "下载 SVG"
    divContainer.appendChild(downloadSvgLink)

    const downloadPngLink = document.createElement("a")
    downloadPngLink.href = convertSvgToPng(svgData)
    downloadPngLink.download = `${inputText}.png`
    downloadPngLink.textContent = "下载 PNG"
    divContainer.appendChild(downloadPngLink)
    // button
    // const newButton = document.createElement("button")
    // newButton.textContent = "Download PNG"
    // newButton.addEventListener("click", () => convertSvgToPng(svgData))
    // divContainer.appendChild(newButton)

    if (animate) {
      characterTargetRef.current.appendChild(divContainer)
    }
  }

  const convertSvgToPng = (svgData: string) => {
    // console.log(svgData)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const v = Canvg.fromString(ctx, svgData)
    v.start()
    return canvas.toDataURL("img/png")
  }

  const handleClear = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    handleClearData()
    setInputText("")
  }

  const handleClearData = () => {
    if (characterTargetRef.current) {
      characterTargetRef.current.innerHTML = ""
    }
  }

  return (
    <>
      <h1>汉字 SVG、PNG</h1>
      <div className='container'>
        <div className='input'>
          <input type='text' value={inputText} onChange={handleInputChange} />
          <div className='button-container'>
            <button
              id='submit'
              onClick={event => handleGenerate(event, "submit")}>
              生成
            </button>
            <button
              id='animate'
              onClick={event => handleGenerate(event, "animate")}>
              动画
            </button>
            <button id='clear' onClick={handleClear}>
              清除
            </button>
          </div>
        </div>
        <div className='output'>
          <div id='character-target-div' ref={characterTargetRef}></div>
        </div>
      </div>
      <CopyRight />
    </>
  )
}

export default App
