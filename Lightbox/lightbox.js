function Lightbox(opts) {
    const defaultOptions = {
        showCount : true, //czy pokazywać licznik
        showText : true, //czy pokazywać opis zdjęcia
        closeOnBg : false, //czy zamykać poprzez kliknięcie na bg
        showThumbnails : true, //czy pokazywać miniaturki
        prevText : "Poprzednie zdjęcie",
        nextText : "Następne zdjęcie",
        closeText : "Zamknij",
        errorText : "Błąd wczytywania grafiki"
    }
    let options = { ...defaultOptions, ...opts, }
    let links = [];
    let currentIndex = 0;
    let DOM = getElementsReference();

    if (!options.showCount) hideCount();
    if (!options.showText) hideText();

    bindEvents();

    function getCurrentIndex(img) {
        const index = [...links].indexOf(img);
        return index !== 0 ? index : 0;
    }

    function createLightbox() {
        const lightbox = document.createElement("div");
        lightbox.classList.add("lightbox");
        lightbox.innerHTML = `
            <div class="lightbox-box">
                <div class="lightbox-count">
                </div>
                <div class="lightbox-img-cnt">
                    <button class="lightbox-prev">
                        ${options.prevText}
                    </button>
                    <button class="lightbox-next">
                        ${options.nextText}
                    </button>
                    <img src="" class="lightbox-img" alt="">
                </div>
                <div class="lightbox-text">
                </div>
                <button class="lightbox-close">
                    ${options.closeText}
                </button>
            </div>
            <div class="lightbox-thumbnails">
                <ul class="lightbox-thumbnails-list"></ul>
            </div>
        `;
        return lightbox;
    }

    function getElementsReference() {
        const ob = {};
        ob.lightbox = createLightbox();
        ob.count = ob.lightbox.querySelector(".lightbox-count");
        ob.box = ob.lightbox.querySelector(".lightbox-box");
        ob.prev = ob.lightbox.querySelector(".lightbox-prev");
        ob.next = ob.lightbox.querySelector(".lightbox-next");
        ob.imgCnt = ob.lightbox.querySelector(".lightbox-img-cnt");
        ob.img = ob.lightbox.querySelector(".lightbox-img");
        ob.text = ob.lightbox.querySelector(".lightbox-text");
        ob.close = ob.lightbox.querySelector(".lightbox-close");
        ob.thumbnails = ob.lightbox.querySelector(".lightbox-thumbnails");
        ob.thumbnailsList = ob.lightbox.querySelector(".lightbox-thumbnails-list");
        return ob;
    }

    function correctBoxHeight() {
        const boxMaxHeight = window.innerHeight - DOM.thumbnails.offsetHeight - DOM.text.offsetHeight - DOM.count.offsetHeight;
        DOM.box.style.maxHeight = `${boxMaxHeight}px`;
    }

    function showLightbox() {
        DOM.lightbox.style.height = `${window.innerHeight}px`;
        DOM.lightbox.style.pointerEvents = 'none';
        DOM.lightbox.style.opacity = 0;
        document.body.append(DOM.lightbox);
        correctBoxHeight();

        const anim = DOM.lightbox.animate([
            {opacity: 0},
            {opacity: 1}
        ], {
            duration: 200
        })
        anim.onfinish = () => {
            DOM.lightbox.style.opacity = 1;
            DOM.lightbox.style.pointerEvents = 'all';
        }
    }

    function hideLightbox() {
        const anim = DOM.lightbox.animate([
            {opacity: 1},
            {opacity: 0}
        ], {
            duration: 200
        })
        anim.onfinish = () => DOM.lightbox.remove();
    }

    function showLoading() {
        const div = document.createElement("div");
        div.classList.add("lightbox-img-loading");
        DOM.imgCnt.append(div);
    }

    function hideLoading() {
        if (DOM.imgCnt.querySelector(".lightbox-img-loading")) {
            DOM.imgCnt.querySelector(".lightbox-img-loading").remove();
        }
    }

    function showError() {
        const div = document.createElement("div");
        div.classList.add("lightbox-img-error");
        div.innerHTML = options.errorText;
        DOM.imgCnt.append(div);
    }

    function hideError() {
        if (DOM.imgCnt.querySelector(".lightbox-img-error")) {
            DOM.imgCnt.querySelector(".lightbox-img-error").remove();
        }
    }

    function showImage(src, text = "") {
        hideLoading();
        hideError();
        showLoading();

        DOM.img.src = src;
        DOM.text.innerHTML = text;
        if (options.showCount) showCount();

        setActiveThumbnail();
    }

    function nextImage() {
        currentIndex++;
        if (currentIndex > links.length - 1) currentIndex = 0;
        const href = links[currentIndex].href;
        const text = links[currentIndex].getAttribute("data-text") ? links[currentIndex].getAttribute("data-text") : "&nbsp"
        showImage(href, text)
    }

    function prevImage() {
        currentIndex--;
        if (currentIndex < 0) currentIndex = links.length - 1;
        const href = links[currentIndex].href;
        const text = links[currentIndex].getAttribute("data-text") ? links[currentIndex].getAttribute("data-text") : "&nbsp"
        showImage(href, text)
    }

    function bindEvents() {
        DOM.prev.addEventListener("click", () => {
            prevImage();
        });

        DOM.next.addEventListener("click", () => {
            nextImage();
        });

        DOM.close.addEventListener("click", () => {
            hideLightbox();
        });

        if (options.closeOnBg) {
            DOM.lightbox.addEventListener("click", () => {
                hideLightbox();
            })
            DOM.imgCnt.addEventListener("click", e => e.stopPropagation());
        }

        document.addEventListener("keyup", e => {
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "Escape") hideLightbox();
        })

        DOM.img.addEventListener("load", () => {
            hideLoading();
            hideError();
        });

        DOM.img.addEventListener("error", () => {
            hideLoading();
            showError();
        });

        DOM.thumbnails.addEventListener("click", () => {
            const el = e.target.closest(".lightbox-thumbnails-el");
            if (el) {
                e.preventDefault();
                currentIndex = [...DOM.thumbnailsList.children].indexOf(el);
                showImage(el.href, el.getAttribute("data-text") ? el.getAttribute("data-text") : "&nbsp")
            }
        })
    }

    function hidePrevNext() {
        DOM.prev.style.display = "none";
        DOM.next.style.display = "none";
    }

    function showPrevNext() {
        DOM.prev.style.display = "block";
        DOM.next.style.display = "block";
    }

    function hideText() {
        DOM.text.style.display = "none";
        correctBoxHeight();
    }

    function showText() {
        DOM.text.style.display = "block";
        correctBoxHeight();
    }

    function hideCount() {
        DOM.count.innerHTML = "";
        DOM.count.style.display = "none";
        correctBoxHeight();
    }

    function showCount() {
        DOM.count.innerHTML = `${currentIndex + 1} / ${links.length}`;
        DOM.count.style.display = "block";
        correctBoxHeight();
    }

    function hideThumbnails() {
        DOM.thumbnails.style.display = "none";
        DOM.lightbox.classList.remove("lightbox--gallery");
        correctBoxHeight();
    }

    function showThumbnails() {
        DOM.thumbnails.style.display = "block";
        DOM.lightbox.classList.add("lightbox--gallery");
        correctBoxHeight();
    }

    function makeThumbnails() {
        DOM.thumbnailsList.innerHTML = "";

        links.forEach(link => {
            const thumb = document.createElement("a");
            thumb.href = link.href;
            thumb.classList.add("lightbox-thumbnails-el");
            const img = document.createElement("img");
            img.src = link.href;
            thumb.append(img);
            thumb.dataset.text = link.dataset.text;
            DOM.thumbnailsList.append(thumb);
        })
    }

    function setActiveThumbnail() {
        const thumbnails = [...DOM.thumbnailsList.children];
        thumbnails.forEach(link => {
            link.classList.remove("is-active");
        })
        thumbnails[currentIndex].classList.add("is-active");
    }

    function addLinks(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.tagName === "A" && el.href) {
                el.addEventListener("click", e => {
                    e.preventDefault();
                    const href = el.getAttribute("href");
                    currentIndex = getCurrentIndex(el);
                    showLightbox();
                    showImage(href, el.getAttribute("data-text") ? el.getAttribute("data-text") : "&nbsp")
                })
                links.push(el);
            }
        })

        makeThumbnails();

        if (links.length > 1) {
            if (options.showCount) showCount();
            showPrevNext();
            if (options.showThumbnails) showThumbnails();
        } else {
            hideCount();
            hidePrevNext();
            if (options.showThumbnails) hideThumbnails();
        }
    }

    function removeLinks(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.tagName === "A") {
                links = links.filter(linkToImg => el !== linkToImg);
            }
        });

        makeThumbnails();

        if (links.length > 1) {
            if (options.showCount) showCount();
            showPrevNext();
            if (options.showThumbnails) showThumbnails();
        } else {
            hideCount();
            hidePrevNext();
            if (options.showThumbnails) hideThumbnails();
        }
    }

    return {
        addLinks,
        removeLinks,
        hidePrevNext,
        showPrevNext,
        hideText,
        showText,
        hideCount,
        showCount,
        showThumbnails,
        hideThumbnails,
    }
}