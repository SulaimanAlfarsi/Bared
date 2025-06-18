let darkmode = document.querySelector('#darkmode');
let logoImg = document.querySelector('.logo img');
let heroImg = document.querySelector('.hero-img img');

darkmode.onclick = () => {
    if (darkmode.classList.contains('bx-moon')) {
        darkmode.classList.replace('bx-moon', 'bx-sun');
        document.body.classList.add('color');
        
        // Change the logo image source to the dark mode logo
        logoImg.src = 'pic/Bared.png';
        logoImg.alt = 'Dark Mode Logo Alt Text'; // Change alt text accordingly
        
        // Change the hero image source to the dark mode hero image
        heroImg.src = 'pic/tot.png';
        heroImg.alt = 'Dark Mode Hero Alt Text'; // Change alt text accordingly
    } else {
        darkmode.classList.replace('bx-sun', 'bx-moon');
        document.body.classList.remove('color');
        
        // Change the logo image source back to the original logo
        logoImg.src = 'pic/SL.png';
        logoImg.alt = ''; // Clear alt text if needed
        
        // Change the hero image source back to the original hero image
        heroImg.src = 'pic/p_and_p.png';
        heroImg.alt = ''; // Clear alt text if needed
    }
}


let menu =document.querySelector('#menu-icon');
let navlist =document.querySelector('.navlist');

menu.onclick = () =>{
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('opne');
};

window.onscroll = () =>{
    menu.classList.remove('bx-x');
    navlist.classList.remove('open');
};





const sr = ScrollReveal ({
    distance:'70px',
    duration:2700,
    reset:true
});

sr.reveal('.hero-text',{delay:200,origin:'bottom'});
sr.reveal('.hero-img',{delay:250,origin:'top'});
