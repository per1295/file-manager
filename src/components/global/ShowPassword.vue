<template>
    <svg @click="setIsShowPassword" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 7C0 7 3.375 0.8125 9 0.8125C14.625 0.8125 18 7 18 7C18 7 14.625 13.1875 9 13.1875C3.375 13.1875 0 7 0 7ZM9 10.9375C10.0443 10.9375 11.0458 10.5227 11.7842 9.78423C12.5227 9.04581 12.9375 8.04429 12.9375 7C12.9375 5.95571 12.5227 4.95419 11.7842 4.21577C11.0458 3.47734 10.0443 3.0625 9 3.0625C7.95571 3.0625 6.95419 3.47734 6.21577 4.21577C5.47734 4.95419 5.0625 5.95571 5.0625 7C5.0625 8.04429 5.47734 9.04581 6.21577 9.78423C6.95419 10.5227 7.95571 10.9375 9 10.9375Z" fill="url(#paint0_linear_26_13)"/>
        <defs>
            <linearGradient id="paint0_linear_26_13" x1="9" y1="0.8125" x2="9" y2="13.1875" gradientUnits="userSpaceOnUse">
                <stop stop-color="#292739"/>
                <stop offset="1"/>
            </linearGradient>
        </defs>
    </svg>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';

    defineProps({
        setIsShowPassword: {
            type: Function as PropType<(payload: MouseEvent) => void>,
            required: true
        }
    });
</script>