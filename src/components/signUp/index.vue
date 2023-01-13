<template>
    <layout-vue>
        <form class="signUp-form" @submit.prevent="submitForm">
            <title-vue>
                <template #title="{className}">
                    <span :class="className">Create an account</span>
                </template>
                <template #subtitle="{className}">
                    <span :class="className">Connect with your friends today!</span>
                </template>
            </title-vue>
            <div class="signUp-form-main">
                <input-vue
                    type="text"
                    name="username"
                    placeholder="Enter Your Username"
                    :max-length="10"
                    :min-length="1"
                    v-model:username="signUpData.username"
                />
                <input-vue
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    :max-length="50"
                    :min-length="5"
                    v-model:email="signUpData.email"
                />
                <input-vue
                    type="tel"
                    name="tel"
                    placeholder="Enter Your Phone Number"
                    :max-length="15"
                    :min-length="10"
                    v-model:tel="signUpData.tel"
                />
                <input-vue
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    :max-length="50"
                    :min-length="10"
                    v-model:password="signUpData.password"
                />
            </div>
            <form-button-vue class="signUp-form-button">
                Sign Up
            </form-button-vue>
            <form-bottom-vue>
                <template #main="{ className }">
                    <span :class="className">Already have an account?</span>
                </template>
                <template #link="{ className }">
                    <router-link :to="{ name: 'login' }" :class="className">Login</router-link>
                </template>
            </form-bottom-vue>
        </form>
    </layout-vue>
</template>

<script setup lang="ts">
    import TitleVue from '../global/Title.vue';
    import InputVue from '../global/Input.vue';
    import FormButtonVue from '../global/FormButton.vue';
    import FormBottomVue from '../global/FormBottom.vue';
    import LayoutVue from '../global/Layout.vue';

    import { reactive } from 'vue';
    import axios from 'axios';
    import type { SignUpData, CustomResponse } from "../../../data-types";
    import useNotifications from '../../../pinia/useNotifications';
    import { useRouter } from 'vue-router';
    import cookie from "cookiejs";

    const router = useRouter();

    const notificationsStore = useNotifications();
    const { addNotification, addNotifications } = notificationsStore;

    const signUpData = reactive<Omit<SignUpData, "isProfileImg">>({
        username: "",
        email: "",
        tel: "",
        password: ""
    });

    const submitForm = async () => {
        try {
            cookie.clear();
            localStorage.clear();

            const response = await axios.post<CustomResponse<string>>("/user data", signUpData, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            const { data } = response;
            const { message, status } = data;

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
    .signUp-form {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        @media screen and (max-width: 425px) {
            padding: 40px 0;
        }

        .signUp-form-main {
            margin-top: 36px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            row-gap: 28px;

            @media screen and (max-width: 425px) {
                width: 80%;
                max-width: 312px;
                align-items: center;
            }
        }

        .signUp-form-button {
            margin-top: 29px;
        }
    }
</style>