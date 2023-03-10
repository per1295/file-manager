<template>
    <layout-vue>
        <div class="file-manager">
            <div class="file-manager-wrapper">
                <profile-vue/>
                <div class="file-manager-inventory-wrapper">
                    <inventory-vue/>
                    <modal/>
                </div>
            </div>
            <footer-vue/>
        </div>
    </layout-vue>
</template>

<script setup lang="ts">
    import ProfileVue from './Profile.vue';
    import InventoryVue from './Inventory.vue';
    import FooterVue from './Footer.vue';
    import Modal from "./Modal.vue";
    import LayoutVue from '../global/Layout.vue';

    import { onMounted } from 'vue';
    import axios from 'axios';
    import useNotifications from '../../../pinia/useNotifications';
    import useUserData from "../../../pinia/useUserData";
    import cookie from "cookiejs";
    import type { SignUpData, CustomResponse, CheckUserResponse } from '../../../data-types';
    import { storeToRefs } from 'pinia';
    import { checkFields } from '../../../functions';

    const notificationsStore = useNotifications();
    const { addNotification } = notificationsStore;

    const userDataStore = useUserData();
    const { setUserData } = userDataStore;

    onMounted(async () => {
        try {
            const { userData } = storeToRefs(userDataStore);

            if ( checkFields(userData.value, "id", "username", "email", "tel", "password") ) return;

            const cookies = cookie.all() as unknown as Omit<SignUpData, "profileImg">;

            if ( !checkFields(cookies, "id", "username", "email", "tel", "password") ) {
                throw new Error("You need first to login");
            }

            cookies.email = decodeURIComponent(cookies.email);

            const response = await axios.get<CustomResponse<CheckUserResponse>>("/check user", {
                params: {
                    ...cookies
                }
            });

            const { status, message } = response.data;

            if ( status === "success" ) {
                const newCookies = cookie.all() as unknown as SignUpData;
                const profileImg = message.profileImg;

                if ( !profileImg ) {
                    addNotification({
                        status: "inf",
                        title: "Add profile image",
                        description: "Click or drag an image onto an element"
                    });
                } else {
                    localStorage.setItem("profileImg", profileImg);
                }

                setUserData({
                    ...newCookies,
                    profileImg
                }, true);

                addNotification({
                    status: "success",
                    title: message.text
                });
            } else {
                addNotification({
                    status: "fail",
                    title: message.text
                });
            }
        } catch (error) {
            const e = error as Error;

            console.log(e);

            addNotification({
                status: "fail",
                title: e.message
            });
        }
    });
</script>

<style lang="scss">
    .file-manager {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 20px;

        @media screen and (max-width: 800px) {
            padding: 40px 0;
        }

        .file-manager-wrapper {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            column-gap: 40px;

            @media screen and (max-width: 800px) {
                flex-direction: column;
                row-gap: 40px;
            }

            .file-manager-inventory-wrapper {
                position: relative;
                width: calc(90% - 276px);
                overflow-x: hidden;

                @media screen and (max-width: 800px) {
                    width: 80%;
                    max-width: 80%;
                }
            }
        }
    }
</style>