const SkeletonLoader = ({ height = "h-16", width = "w-full" }) => {
    return (
        <div className={`animate-pulse ${width} flex flex-col space-y-4`}>
            <div className={`${height} bg-gradient-to-r from-gray-300 to-gray-200 rounded-md shadow-md`}></div>
            <div className={`${height} bg-gradient-to-r from-gray-300 to-gray-200 rounded-md shadow-md`}></div>
            <div className={`${height} bg-gradient-to-r from-gray-300 to-gray-200 rounded-md shadow-md`}></div>
        </div>
    );
};

export default SkeletonLoader;
