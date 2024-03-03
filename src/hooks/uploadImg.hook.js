export const useUploadImg = (e, inputImg = false, setImgFile, setInputError, setUserImageSrc = false, changeImg = false) => {
    const file = e.target.files[0];
    setImgFile(file);

    if (file) {
        const imageUrl = URL.createObjectURL(file);

        if (setUserImageSrc) {
            setUserImageSrc(imageUrl);
        } else {
            inputImg.current.setAttribute("src", imageUrl);
        }

        if (changeImg && inputImg) {
            inputImg.current.style.opacity = 1;
        }
        setInputError(false);
    }

    e.target.value = null;
}