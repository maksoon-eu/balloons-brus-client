import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import './changeModal.scss';

const ChangeModal = ({changeModal, setChangeModal}) => {
    const refChange = useRef(null);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (changeModal && refChange.current && !refChange.current.contains(e.target)) {
                setChangeModal(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [changeModal])

    return (
        <motion.div 
            variants={{
                open: {
                    opacity: 1,
                    y: 0,
                    display: 'block'
                },
                closed: {
                    opacity: 0,
                    y: -100,
                    display: 'none',
                    transition: {
                        display: {delay: .4}
                    }
                }
            }}
            initial={{opacity: 0, y: -100}}
            animate={changeModal ? "open" : "closed"}
            className="create__modal"
            transition={{duration: .4}}
        >
            <div ref={refChange} className="change__content">ffffff</div>
        </motion.div>
    )
}

export default ChangeModal