window.onload = init;
function init() {
  // Elements
  const copyright = document.getElementById("copyright");
  const rentBtn = document.getElementById("rentBtn");
  const saleBtn = document.getElementById("saleBtn");
  const authTypeBtn = document.getElementById("authType");
  const corporateArea = document.getElementById("corporateArea");
  const terms = document.getElementById("terms");
  const submitBtn = document.getElementById("submitBtn");
  const companyName = document.getElementById("companyName");
  const companyAddress = document.getElementById("companyAddress");
  const imagesInput = document.getElementById("images");
  const userImageInput = document.getElementById("userImage");
  const citySelection = document.getElementById("city");
  const districtSelection = document.getElementById("district");
  const priceTexts = document.getElementsByClassName("price");
  const favoriteBtns = document.getElementsByClassName("favorite-btn");
  const menuBtn = document.getElementById("menu-btn");
  const filterMenu = document.getElementById("filter-menu");

  // Copyright
  const currentDate = new Date();
  copyright.innerText = currentDate.getFullYear();

  // Adding active class for tabs
  if (window.location.pathname.includes("sale")) {
    saleBtn.classList.add("active");
    rentBtn.classList.remove("active");
  } else if (window.location.pathname.includes("rent")) {
    saleBtn.classList.remove("active");
    rentBtn.classList.add("active");
  }

  // Toggle corporate area and its required
  authTypeBtn &&
    authTypeBtn.addEventListener("change", () => {
      corporateArea.classList.toggle("d-none", !authTypeBtn.checked);
      companyAddress.toggleAttribute("required", authTypeBtn.checked);
      companyName.toggleAttribute("required", authTypeBtn.checked);
    });

  // Terms check
  terms &&
    terms.addEventListener("change", () => {
      submitBtn.classList.toggle("disabled", !terms.checked);
    });

  // Upload image to cloudinary for new houses
  const sendFiles = async () => {
    const images = document.getElementById("images").files;
    const urlInput = document.getElementById("imageUrls");

    for (let i = 0; i < images.length; i++) {
      const data = new FormData();

      data.append("file", images[i]);
      data.append("upload_preset", "l7zb8egp");
      data.append("cloud_name", "dtzs4c2uv");
      fetch("https://api.cloudinary.com/v1_1/dtzs4c2uv/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          urlInput.innerText += data.url + " ";
        });
    }
  };

  imagesInput &&
    imagesInput.addEventListener("change", () => {
      sendFiles();
    });

  // Getting districts for selected city
  citySelection &&
    citySelection.addEventListener("change", (e) => {
      let selectedCity = e.target.value;
      for (let i = 0; i < districtSelection.childElementCount; i++) {
        districtSelection.children[i].toggleAttribute(
          "hidden",
          !districtSelection.children[i].classList.contains(selectedCity)
        );
      }
    });

  // Upload image or logo
  const sendImage = async () => {
    const image = document.getElementById("userImage").files;
    const urlInput = document.getElementById("userImageUrl");
    const userPhoto = document.getElementById("userPhoto");

    const data = new FormData();

    data.append("file", image[0]);
    data.append("upload_preset", "l7zb8egp");
    data.append("cloud_name", "dtzs4c2uv");
    fetch("https://api.cloudinary.com/v1_1/dtzs4c2uv/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url);
        urlInput.innerText = data.url;
        userPhoto.src = data.url;
      });
  };
  userImageInput &&
    userImageInput.addEventListener("change", () => {
      sendImage();
    });

  // Adding dot after 3 digit
  const numberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  for (let i = 0; i < priceTexts.length; i++) {
    const price = priceTexts[i].innerText;
    priceTexts[i].innerText = numberWithDots(price);
  }

  // Adding to favorite
  for (let i = 0; i < favoriteBtns.length; i++) {
    favoriteBtns[i].addEventListener("click", () => {
      let exist = favoriteBtns[i].innerHTML.includes(
        '<i class="fa-solid fa-heart"></i>'
      );
      if (!exist) {
        favoriteBtns[i].innerHTML = '<i class="fa-solid fa-heart"></i>';
        exist = true;
      } else {
        favoriteBtns[i].innerHTML = '<i class="fa-regular fa-heart"></i>';
        exist = false;
      }
    });
  }

  // Toggle Menu
  menuBtn && menuBtn.addEventListener("click",()=>{
    window.scroll(0,0);
    filterMenu.classList.toggle("d-none");
  });
}
