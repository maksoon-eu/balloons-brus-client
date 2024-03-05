import { motion } from "framer-motion";

import AboutInfo from "../components/aboutInfo/AboutInfo";
import SendMessage from "../components/sendMessage/SendMessage";

const AboutPage = () => {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        >
            <AboutInfo/>
            <SendMessage/>
        </motion.div>
    )
}

export default AboutPage;