import React from 'react'
import './style.css'

const Popup = ({ children, isOpen, onClose, customStyle = {}, className = '' }) => {
  const closePopup = () => {
    onClose && onClose()
  }

  return (
    isOpen && (
      <div className="popup">
        <div
          className={`popup-content ${className}`}
          style={customStyle}
        >
          <span className="popup-close" onClick={closePopup}>X</span>
          {children}
        </div>
      </div>
    )
  )
}

export default Popup;
