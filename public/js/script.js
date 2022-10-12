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
  const companyName=document.getElementById('companyName');
  const companyAddress=document.getElementById('companyAddress');

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
  authTypeBtn.addEventListener("change", () => {
    corporateArea.classList.toggle("d-none", !authTypeBtn.checked);
    companyAddress.toggleAttribute('required',authTypeBtn.checked);
    companyName.toggleAttribute('required',authTypeBtn.checked);
  });

  // Terms check
  terms.addEventListener("change", () => {
    submitBtn.classList.toggle("disabled", !terms.checked);
  });
}
