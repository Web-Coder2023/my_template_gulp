document.addEventListener("DOMContentLoaded", function () {
   const menuTitle = document.querySelector(".header__burger");
   const menuList = document.querySelector(".header__menu-body");
 
   menuTitle.addEventListener("click", function () {
     if (menuList.classList.contains("active")) {
       menuList.style.maxHeight = "0";
       menuList.classList.remove("active");
     } else {
       menuList.style.maxHeight = "none";
       const computedHeight = getComputedStyle(menuList).height;
       menuList.style.maxHeight = "0";
       menuList.classList.add("active");
 
       // Задержка для корректной анимации
       setTimeout(() => {
         menuList.style.height = computedHeight;
       }, 0);
     }
   });
 });
 