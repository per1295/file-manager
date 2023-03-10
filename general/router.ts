import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import axios from "axios";
import cookie from "cookiejs";
import type { SignUpData } from "../data-types";
import useNotifications from "../pinia/useNotifications";
import useUserData from "../pinia/useUserData";

const Login = () => import("../src/components/login/index.vue");
const SignUp = () => import("../src/components/signUp/index.vue");
const Manager = () => import("../src/components/manager/index.vue");

const history = typeof window === "undefined" ? createMemoryHistory() : createWebHistory();

const router = createRouter({
    history,
    scrollBehavior(to, _f, savedPosition) {
        if ( to.hash ) return { el: to.hash }
        if ( savedPosition ) return savedPosition;

        return {
            top: 0,
            behavior: "smooth"
        }
    },
    routes: [
        {
            name: "login",
            path: "/login",
            component: Login
        },
        {
            name: "sign_up",
            path: encodeURI("/sign up"),
            component: SignUp
        },
        {
            name: "file_manager",
            path: "/manager/:id(\\d+)",
            component: Manager
        },
        {
            path: "/",
            redirect: "/login",
        }
    ]
});

router.beforeEach(async (to, from) => {
    const cookies = cookie.all() as unknown as SignUpData;

    if ( to.name !== "file_manager" && !from.name ) {
        axios.defaults.baseURL = "/";

        const response = await axios.get<string | SignUpData>("/api/check user");
        
        if ( response.status < 400 ) {
            const { data } = response;

            if ( data instanceof Object ) {
                const userDataStore = useUserData();
                const { setUserData } = userDataStore;

                setUserData(data, true);

                return {
                    name: "file_manager",
                    params: {
                        id: cookies.id
                    }
                }
            }
        }
    }
});

router.afterEach((to, from) => {
    if ( !/^\/$/.test(to.path) ) {
        let path = to.path.replace(/^\//, "").replace(/\/$/, "").replace(/(?<=[\w\d])\/(?=[\w\d])/g, "-");
        path = path.split("").map((letter, index) => index === 0 ? letter.toUpperCase() : letter).join("");
        document.title = decodeURI(path);
    }

    if ( to.name === "file_manager" || from.name === "file_manager" ) {
        to.meta.transitionName = "file-manager";
    } else {
        to.meta.transitionName = "base-transition";
    }

    axios.defaults.baseURL = `/api${to.path}`;

    const notificationsStore = useNotifications();
    const { clearWaitingNotifications } = notificationsStore;

    clearWaitingNotifications();
});

export default router;