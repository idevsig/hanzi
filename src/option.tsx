import { useState } from "react"
import Modal, { Styles } from "react-modal"
import { SketchPicker } from "react-color"

Modal.setAppElement("#root")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Option = (props: any) => {
  const {
    fontSize,
    radicalColor,
    handleFontSizeChange,
    handleRadicalColorChange,
  } = props

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const customStyles: Styles = {
    content: {
      margin: "auto",
      padding: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // justifyContent: "center",
    },
  }

  return (
    <div>
      <button onClick={openModal}>字体选项</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}>
        <div
          style={{
            fontSize: `${fontSize}px`,
            color: radicalColor,
            margin: "0 auto",
          }}>
          和
        </div>
        <div className='option-container'>
          <div className='item'>
            <h2>部首颜色</h2>
            <SketchPicker
              color={radicalColor}
              onChangeComplete={color => handleRadicalColorChange(color.hex)}
            />
          </div>
          <div className='item'>
            <h2>字体大小</h2>
            <input
              type='number'
              step='1'
              value={fontSize}
              onChange={event => handleFontSizeChange(event.target.value)}
            />
          </div>
        </div>
        <button className='close-button' onClick={closeModal}>
          关闭
        </button>
      </Modal>
    </div>
  )
}

export default Option
