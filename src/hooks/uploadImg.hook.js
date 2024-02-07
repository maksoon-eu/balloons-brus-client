export const useUploadImg = (e, inputImg = false, setImgFile, setInputError, elem = false, setUserImageSrc = false, changeImg = false) => {
    const file = e.target.files[0];
    setImgFile(e.target.files[0]);

    if (file) {
        const imageUrl = URL.createObjectURL(file);

        if (setUserImageSrc) {
            setUserImageSrc(imageUrl);
        } else {
            inputImg.current.setAttribute("src", imageUrl);
        }

        if (changeImg || inputImg) {
            inputImg.current.style.opacity = 1;
        }

        if (elem) {
            elem.style.transform = 'translateY(-965%) translateX(-125%) scale(.7)';
        }
        setInputError(false);
    }

    e.target.value = null;
}