window.onload = init;
function init() {
  // Copyright
  const copyright = document.getElementById("copyright");
  const currentDate = new Date();
  copyright.innerText = currentDate.getFullYear();

  // Adding active class for tabs
  const rentBtn = document.getElementById("rentBtn");
  const saleBtn = document.getElementById("saleBtn");

  if (window.location.pathname.includes('sale')) {
    saleBtn.classList.add("active");
    rentBtn.classList.remove("active");
  } else if(window.location.pathname.includes('rent')) {
    saleBtn.classList.remove("active");
    rentBtn.classList.add("active");
  }

  // Toggle Corporate Area
  const authTypeBtn=document.getElementById('authType');
  const corporateArea=document.getElementById('corporateArea');

  authTypeBtn.addEventListener('change',()=>{
    corporateArea.classList.toggle('d-none',!authTypeBtn.checked);
  });
}
