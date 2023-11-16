const preloader = function () {
    document.addEventListener('DOMContentLoaded', function () {
        let preloaderClassName = document.querySelector('.preloader');
        if (!preloaderClassName.classList.contains('hide')) {
            preloaderClassName.classList.add('hide');
        }
    });
};
preloader();