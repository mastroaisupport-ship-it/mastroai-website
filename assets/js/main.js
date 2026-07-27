/* ==========================================
   MastroAI Landing Animations
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       Navbar Scroll
    ========================== */

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });

    /* ==========================
       Hero Animation
    ========================== */

    const heroContent = document.querySelector(".hero-content");
    const heroPhone = document.querySelector(".hero-phone");

    if(heroContent){

        heroContent.animate([

            {
                opacity:0,
                transform:"translateY(40px)"
            },

            {
                opacity:1,
                transform:"translateY(0)"
            }

        ],{

            duration:900,
            easing:"ease-out",
            fill:"forwards"

        });

    }

    if(heroPhone){

        heroPhone.animate([

            {
                opacity:0,
                transform:"translateY(60px) scale(.92)"
            },

            {
                opacity:1,
                transform:"translateY(0) scale(1)"
            }

        ],{

            duration:1200,
            easing:"ease-out",
            fill:"forwards"

        });

    }

    /* ==========================
       Reveal Sections
    ========================== */

    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:.15

    });

    sections.forEach(section=>{

        section.classList.add("hidden");

        observer.observe(section);

    });

});
