export const handleDragOver = (e) => {
    e.preventDefault();
};

export const handleDrop = (e, refImg, changeImg = false, setUserImageSrc = false) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);

        if (changeImg) {
            setUserImageSrc(imageUrl);
        } else {
            refImg.current.setAttribute('src', imageUrl);
        }

        if (!changeImg) {
            refImg.current.style.opacity = 1;
        }

        const parentDiv = e.target.closest('.create__modal-img');

        const input = parentDiv.querySelector('.input-file');

        input.files = e.dataTransfer.files;

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
    }
};
