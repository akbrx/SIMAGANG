// /src/controllers/404-controller.js

import { NotFoundView } from '../views/404-view.js';

export class NotFoundController {
    constructor() {
        this.view = new NotFoundView();
    }

    showNotFoundPage() {
        this.view.render();
    }
}