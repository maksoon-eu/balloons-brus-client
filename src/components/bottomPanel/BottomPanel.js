import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import './bottomPanel.scss';

const BottomPanel = () => {
    return (
        <div className="panel">
            <div className="panel__inner">
            <motion.div
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.9 }}
            >
                <NavLink 
                    to='/catalog' 
                    className={({ isActive }) => isActive ? "panel__icon panel__icon--active" : "panel__icon"}
                >
                    <svg fill="#fff" width="20px" height="20px" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                        <path d="M395 156h460q21 0 36 15t15 36v23q0 21-15 36t-36 15H395q-21 0-36-15t-15-36v-23q0-21 15-36t36-15zm0 281h460q21 0 36 15t15 37v22q0 22-15 36.5T855 562H395q-21 0-36-14.5T344 511v-22q0-22 15-36.5t36-14.5v-1zm0 282h460q21 0 36 15t15 36v23q0 21-15 36t-36 15H395q-21 0-36-15t-15-36v-23q0-21 15-36t36-15zM146 125h83q21 0 36.5 15.5T281 178v82q0 22-15.5 37.5T229 313h-83q-21-1-36.5-16T94 260v-82q0-22 15.5-37.5T146 125zm0 281h83q21 0 36.5 15.5T281 459v82q0 22-15.5 37.5T229 594h-83q-21 0-36.5-15.5T94 541v-82q0-22 15.5-37.5T146 406zm0 281h83q21 0 36.5 15.5T281 740v82q0 22-15.5 37.5T229 875h-83q-21 0-36.5-15.5T94 822v-82q0-22 15.5-37.5T146 688v-1z"/>
                    </svg>
                </NavLink>
            </motion.div>
            <motion.div
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.9 }}
            >
                <NavLink 
                    to='/info' 
                    className={({ isActive }) => isActive ? "panel__icon panel__icon--active" : "panel__icon"}
                >
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.8284 7 13.5 6.32843 13.5 5.5C13.5 4.67157 12.8284 4 12 4C11.1716 4 10.5 4.67157 10.5 5.5C10.5 6.32843 11.1716 7 12 7ZM11 9C10.4477 9 10 9.44772 10 10C10 10.5523 10.4477 11 11 11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V10C13 9.44772 12.5523 9 12 9H11Z" fill="#fff"/>
                    </svg>
                </NavLink>
            </motion.div>
            </div>
        </div>
    )
}

export default BottomPanel;