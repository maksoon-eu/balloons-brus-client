import { motion } from 'framer-motion';

const Smooth = ({ children, classNames }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={classNames}>
            {children}
        </motion.div>
    );
};

export default Smooth;
