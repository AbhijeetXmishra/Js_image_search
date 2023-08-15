const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKeys = "OE3rzMMXOCOnN_skYwzK22L539jLYxSQNZ5UJL5zc-0";

let currentPage = 1;
let searchTerm = null;
let searchBar = true;

const downloadImg = (imgURL) =>{
  // console.log(imgURL);
  fetch(imgURL).then(res => res.blob()).then(file => {
    // console.log(file);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
  }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
  // Showing lightbox and setting img source, name and btn attribute
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;

  downloadImgBtn.setAttribute("data-img", img); // Storing the image url as a btn attribute, so we can download it later.

  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

const hideLightbox = () =>{
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";

}

const generateHTML = (images) => {
  // stopPropagation() prevents propagation of the same event from being called
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showLightbox('${img.alt_description}', '${img.urls.small}')">
        <img src="${img.urls.small}" alt="img" />
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.alt_description}</span>
          </div>
          <button onclick="downloadImg('${img.urls.full}');event.stopPropagation();">
            <i class="uil uil-import"></i>
          </button>
        </div>
      </li>`
    )
    .join("");
};
// In this function i just work with get random images.
const getImages = (apiURL) => {
  // Fetching image by API call with authorization headers.

  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");

  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data);
      console.log(data);

      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
};

// In this function i just work with get search images
const getSearchImages = (apiURL) => {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");

  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.results);
      console.log(data);

      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.unsplash.com/photos/random?page=${currentPage}&client_id=${apiKeys}&count=15`;

  // This (?) operator is use to when write some name in text box and click load more button then show only search items not random images.
  apiURL = searchTerm
    ? `https://api.unsplash.com/search/photos?page=${currentPage}&query=${searchTerm}&client_id=${apiKeys}&count=15`
    : apiURL;

  searchBar ? getImages(apiURL) : getSearchImages(apiURL); // if searchBar is true so apiURL render in getImages function otherwise render in getSearchImages function.
};

// This function is use to when we write any thing in search box and press enter.

const loadSearchImages = (e) => {
  // If the search input is empty, set the search term to null and return from here;
  if (e.target.value === "") return (searchTerm = null);
  // If pressed key is enter, update the current page, search term & call the getImages
  if (e.key === "Enter") {
    // console.log("Enter key pressed");
    searchBar = false;
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getSearchImages(
      `https://api.unsplash.com/search/photos?page=${currentPage}&query=${searchTerm}&client_id=${apiKeys}&count=15`
    );
  }
};

getImages(
  `https://api.unsplash.com/photos/random?page=${currentPage}&client_id=${apiKeys}&count=15`
);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
//Passing btn img attribute value as argument to the downloadImg function.
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img))