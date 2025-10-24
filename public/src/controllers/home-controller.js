// /src/controllers/home-controller.js

import { HomeView } from "../views/home-view.js";
import { HomeModel } from "../models/home.js";

export class HomeController {
    constructor() {
        this.homeView = new HomeView();
        this.homeModel = new HomeModel();
    }

    showHomePage() {
        this.homeView.render();
        this.homeView.bindButtons(
            () => window.location.hash = '#/pengajuan',
            () => window.location.hash = '#/lacak'
        );
        this.setupAccordion();
        // PEMANGGILAN setupNavLinks() SUDAH DIHAPUS
    }

    setupAccordion() {
        const accordionItems = document.querySelectorAll(".accordion-item");
        accordionItems.forEach(item => {
            const header = item.querySelector(".accordion-header");
            header.addEventListener("click", () => {
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                    }
                });
                item.classList.toggle("active");
            });
        });

        const lupaIdLinkFaq = document.getElementById("faq-link-lupa-id");
        if (lupaIdLinkFaq) {
            lupaIdLinkFaq.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.hash = "/lupa-id";
            });
        }
    }
    
    // SELURUH FUNGSI setupNavLinks() SUDAH DIHAPUS DARI SINI
}