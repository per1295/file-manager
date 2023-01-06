<template>
    <div class="profile" data-dark-theme="section">
        <div class="profile-conteiner" data-theme="ignore">
            <profile-img-vue/>
            <profile-inf-vue/>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ProfileImgVue from './ProfileImg.vue';
    import ProfileInfVue from "./ProfileInf.vue";
</script>

<style lang="scss">
    .profile {
        width: 236px;
        height: 500px;
        border: 1px solid #4D4D4D;
        border-radius: 12px;
        padding: 18px 14px 24px 14px;

        .profile-conteiner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            row-gap: 20px;
        }
    }
</style>