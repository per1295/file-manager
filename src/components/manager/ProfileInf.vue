<template>
    <div class="profile-inf" data-theme="ignore">
        <blur-row-placeholder-vue
            width="190px"
            height="26px"
            :watch-id="userData.userId"
            :watch-prop="userData.username"
        />
        <div class="profile-inf-subinf" data-theme="ignore">
            <blur-row-placeholder-vue
                v-for="(placeholder, index) of subinfPlaceholders"
                :key="index"
                :width="placeholder.width"
                :height="placeholder.height"
                :watch-id="userData.userId"
                :watch-prop="
                    index === 0
                    ?
                    userData.email
                    :
                    index === 1
                    ?
                    userData.tel
                    :
                    index === 2
                    ?
                    userData.password
                    :
                    undefined
                "
            />
        </div>
        <blur-row-placeholder-vue
            width="80px"
            height="10px"
            :watch-id="userData.userId"
        />
    </div>
</template>

<script setup lang="ts">
    import BlurRowPlaceholderVue from './BlurRowPlaceholder.vue';
    import useUserData from '../../../pinia/useUserData';
    import { storeToRefs } from 'pinia';

    const subinfPlaceholders = [
        {
            width: "155px",
            height: "10px"
        },
        {
            width: "190px",
            height: "10px"
        },
        {
            width: "170px",
            height: "10px"
        },
        {
            width: "160px",
            height: "10px"
        },
        {
            width: "140px",
            height: "10px"
        }
    ];

    const userDataStore = useUserData();
    const { userData } = storeToRefs(userDataStore);
</script>

<style lang="scss">
    .profile-inf {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        row-gap: 24px;
        max-width: 100%;

        .profile-inf-subinf {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            row-gap: 16px;
            max-width: 100%;
        }
    }
</style>