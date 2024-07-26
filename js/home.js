let leftbtn = document.querySelector('.left');
let rightbtn = document.querySelector('.right');
let slide = document.querySelector('.slider');
let selectIndex = 0;

rightbtn.onclick =  function(){
     slide.classList.remove('show');
     selectIndex = (selectIndex<2) ? selectIndex + 1 : 2;
     slide.style.transform = "translate("+ selectIndex * -33.333 +"%)";
     slide.classList.add('show');
}

addEventListener('animationend', () => {
     slide.classList.remove('show');
})

leftbtn.onclick =  function(){
     selectIndex = (selectIndex>0) ? selectIndex - 1 : 0;
     slide.style.transform = "translate("+ selectIndex * -33.333 +"%)";
     slide.classList.add('show');
}