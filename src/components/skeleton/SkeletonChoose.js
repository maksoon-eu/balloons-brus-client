import './skeleton.scss';

const SkeletonChoose = () => {
    return (
        <>
            <div className="skeleton__title skeleton--wave"/>
            <div className="skeleton__flex">
                <div className="skeleton__flex-left skeleton--wave"/>
                <div className="skeleton__flex-right">
                    <div className="skeleton__flex-inner">
                        <div className="skeleton__flex-price skeleton--wave"/>
                        <div className="skeleton__flex-availability skeleton--wave"/>
                        <div className="skeleton__flex-calc skeleton--wave"/>
                        <div className="skeleton__flex-about skeleton--wave"/>
                        <div className="skeleton__flex-info skeleton--wave"/>
                    </div>
                </div>
            </div>
        </>
    )
};

export default SkeletonChoose;
