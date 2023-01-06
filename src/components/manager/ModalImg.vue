<template>
    <img :src="pathToImg" alt="modal-file" class="modal-img"/>
</template>

<script setup lang="ts">
    import useModal from "../../../pinia/useModal";
    import { storeToRefs } from 'pinia';
    import { computed } from "@vue/reactivity";

    const modalStore = useModal();
    const { modalFileData } = storeToRefs(modalStore);

    const pathToImg = computed(() => {
        if ( /^text/.test(modalFileData.value.type) ) return "/text-img.png";
        if ( /^image/.test(modalFileData.value.type) ) return "/image-img.png";
    });
</script>

<style lang="scss">
    .modal-img {
        margin-top: 55px;
        max-width: 50%;
    }
</style>