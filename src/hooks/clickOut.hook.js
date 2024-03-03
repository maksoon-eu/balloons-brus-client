import { useEffect } from "react"

export const useClickOut = (refModal, openModal, setOpenModal, bodyPosition = false, itemChange = false, setShowAnimation = false, setRotationAngle = false, setChangeModal = false) => {
    useEffect(() => {
        const clickOutElement = (e) => {
            if (openModal && refModal.current && !refModal.current.contains(e.target)) {
                if (!itemChange) {
                    setOpenModal(false)
                }
                
                if (bodyPosition) {
                    document.querySelector('body').style.position = 'relative';
                }

                if (itemChange) {
                    console.log(2)
                    setShowAnimation(false)
                    setTimeout(() => {
                        setChangeModal(false)
                        if (setRotationAngle) {
                            setRotationAngle(0)
                        }
                        document.querySelector('body').style.position = 'relative';
                    }, 400)
                }
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [openModal])
}