<template>
    <transition name="modal">
        <div class="modal" v-if="isModalOpen" data-theme="ignore">
            <svg
                @click="closeModal"
                class="modal-cross"
                :class="theme === 'light' ? 'cursor-pointer-light' : 'cursor-pointer-dark'"
                data-cursor="pointer"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 1.05L10.95 0L6 4.95L1.05 0L0 1.05L4.95 6L0 10.95L1.05 12L6 7.05L10.95 12L12 10.95L7.05 6L12 1.05Z" fill="white"/>
            </svg>
            <modal-img-vue/>
            <div class="modal-wrapper" data-theme="ignore">
                <modal-line-vue/>
                <modal-inf-vue v-for="(value, key) in filtredModal">
                    {{ key.split("").map((item, index) => index === 0 ? item.toUpperCase() : item).join("") }}: {{ value }}
                </modal-inf-vue>
                <modal-line-vue/>
            </div>
            <div class="modal-buttons" data-theme="ignore">
                <modal-button-vue type="download" data-theme="ignore">
                    Download
                </modal-button-vue>
                <modal-button-vue type="delete" data-theme="ignore">
                    Delete
                </modal-button-vue>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
    import useModal from "../../../pinia/useModal";
    import useTheme from "../../../pinia/useTheme";
    import { storeToRefs } from "pinia";
    import { getDateTime } from "../../../functions";
    import { computed } from "@vue/reactivity";

    import ModalImgVue from "./ModalImg.vue";
    import ModalLineVue from "./ModalLine.vue";
    import ModalInfVue from "./ModalInf.vue";
    import ModalButtonVue from "./ModalButton.vue";

    const modalStore = useModal();
    const { isModalOpen, modalFileData } = storeToRefs(modalStore);
    const { setIsModalValue } = modalStore;

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore)

    const closeModal = () => setIsModalValue(false);

    const filtredModal = computed(() => ({
        name: modalFileData.value.name,
        type: modalFileData.value.type,
        size: modalFileData.value.size,
        added: getDateTime(modalFileData.value.added)
    }));
</script>

<style lang="scss">
    .modal {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 250px;
        background-color: rgba(38, 38, 38, 0.5);
        border-left: 1px solid #4D4D4D;
        backdrop-filter: blur(8px);
        z-index: 2;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .modal-cross {
            position: absolute;
            top: 14px;
            right: 14px;
        }

        .modal-wrapper {
            width: 88%;
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            row-gap: 16px;
        }

        .modal-buttons {
            position: absolute;
            bottom: 18px;
            left: calc(50% - 105px);
            display: flex;
            align-items: center;
            justify-content: center;
            column-gap: 10px;
        }
    }

    .modal-enter-active, .modal-leave-active {
        transition: transform .35s ease !important;
    }

    .modal-enter-from, .modal-leave-to {
        transform: translateX(250px);
    }
</style>