import "@fontsource/poppins";
import "@fontsource/inter";

import SSRApp from "../general/index";
import axios from "axios";
import { transformRequestBody } from "./functions";

axios.defaults.transformRequest = [
    transformRequestBody
];

window.addEventListener("progress", (event) => {
    console.log(event.loaded + ":" + event.total);
});

SSRApp.mount("#app");