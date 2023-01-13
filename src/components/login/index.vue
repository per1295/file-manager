<template>
    <layout-vue>
        <form class="login-form" @submit.prevent="submitForm">
            <title-vue>
                <template #title="{className}">
                    <span :class="className">Hi, Welcome Back! 👋</span>
                </template>
            </title-vue>
            <div class="login-form-main">
                <form-group-wrapper-vue>
                    <label-vue html-for="email">
                        Email
                    </label-vue>
                    <input-vue
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@gmail.com"
                        :max-length="50"
                        :min-length="5"
                        v-model:email="loginData.email"
                    />
                </form-group-wrapper-vue>
                <form-group-wrapper-vue>
                    <label-vue html-for="password">
                        Password
                    </label-vue>
                    <input-vue
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter Your Password"
                        :max-length="50"
                        :min-length="10"
                        v-model:password="loginData.password"
                    />
                </form-group-wrapper-vue>
                <div class="login-form-main-wrapper-checkbox">
                    <checkbox-vue
                        name="isRemembered"
                        id="checkbox"
                        v-model:isRemembered="loginData.isRemembered"
                    />
                    <label-vue
                        html-for="checkbox"
                        :class-name="theme === 'light' ? 'cursor-pointer-light' : 'cursor-pointer-dark'"
                        data-cursor="pointer"
                    >
                        Remember Me
                    </label-vue>
                </div>
            </div>
            <form-button-vue class-name="login-form-button">
                Login
            </form-button-vue>
            <form-bottom-vue>
                <template #main="{ className }">
                    <span :class="className">Don’t have an account ?</span>
                </template>
                <template #link="{ className }">
                    <router-link :to="{ name: 'sign_up' }" :class="className">Sign Up</router-link>
                </template>
            </form-bottom-vue>
        </form>
    </layout-vue>
</template>

<script setup lang="ts">
    import FormGroupWrapperVue from '../global/FormGroupWrapper.vue';
    import InputVue from '../global/Input.vue';
    import LabelVue from '../global/Label.vue';
    import CheckboxVue from '../global/Checkbox.vue';
    import FormButtonVue from '../global/FormButton.vue';
    import FormBottomVue from '../global/FormBottom.vue';
    import TitleVue from '../global/Title.vue';
    import LayoutVue from '../global/Layout.vue';

    import { RouterLink } from 'vue-router';
    import { reactive } from 'vue';
    import axios from 'axios';
    import type { LoginData, CustomResponse } from "../../../data-types";
    import useNotifications from '../../../pinia/useNotifications';
    import { useRouter } from 'vue-router';
    import cookie from 'cookiejs';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const router = useRouter();

    const notificationStore = useNotifications();
    const { addNotification, addNotifications } = notificationStore;

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    const loginData = reactive<LoginData>({
        email: "",
        password: "",
        isRemembered: false
    });

    const submitForm = async () => {
        try {
            cookie.clear();
            localStorage.clear();

            const response = await axios.post<CustomResponse<string>>("/user data", loginData, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            const { data } = response;
            const { status, message } = data;

            if ( status === "success" ) {
                addNotifications(
                    {
                        status,
                        title: message
                    },
                    {
                        status: "inf",
                        title: "Wait a bit..."
                    }
                );

                const userId = cookie.get("userId");

                if ( userId && typeof userId === "string" ) {
                    router.push({
                        name: "file_manager",
                        params: {
                            userId
                        }
                    });
                } else {
                    addNotification({
                        status: "fail",
                        title: message
                    });
                }
            }
        } catch (error) {
            const e = error as Error;

            console.log(e);

            addNotification({
                status: "fail",
                title: e.message
            });
        }
    }
</script>

<style scoped lang="scss">
    .login-form {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        @media screen and (max-width: 425px) {
            padding: 40px 0;
        }

        .login-form-main {
            @media screen and (max-width: 425px) {
                width: 80%;
                max-width: 312px;
            }
        }

        .login-form-main-wrapper-checkbox {
            position: relative;
            margin-top: 24px;
        }
    }

    .login-form-button {
        margin-top: 31px;
    }
</style>