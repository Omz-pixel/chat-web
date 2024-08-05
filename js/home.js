let leftbtn = document.querySelector('.left');
let rightbtn = document.querySelector('.right');
let slide = document.querySelector('.slider');
let selectIndex = 0;

setInterval(()=>{
     if(selectIndex<3){
          slide.style.transform = "translate("+ selectIndex * -33.333 +"%)";
          slide.classList.add('show');
          selectIndex++;
     }
     else{
          selectIndex = 0;
     }
}, 5000);

addEventListener('animationend', () => {
     slide.classList.remove('show');
})

rightbtn.onclick =  function(){
     selectIndex = (selectIndex<2) ? selectIndex + 1 : 2;
     slide.style.transform = "translate("+ selectIndex * -33.333 +"%)";
     slide.classList.add('show');
}

leftbtn.onclick =  function(){
     selectIndex = (selectIndex>0) ? selectIndex - 1 : 0;
     slide.style.transform = "translate("+ selectIndex * -33.333 +"%)";
     slide.classList.add('show');
}