<template>
    <input
        type="checkbox"
        data-cursor="pointer"
        :name="name"
        :id="id"
        class="custom-checkbox"
        :class="className"
        @change="updateValue($event, $emit)"
        :checked="isRemembered"
    >
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import { updateValue } from "../../functions";

    defineEmits([
        "update:isRemembered"
    ]);

    defineProps({
        name: {
            type: String as PropType<string>,
            required: true
        },
        id: {
            type: String as PropType<string>,
            required: true
        },
        className: {
            type: String as PropType<string>
        },
        required: {
            type: Boolean as PropType<boolean>,
            default: true
        },
        isRemembered: {
            type: Boolean as PropType<boolean>
        }
    });
</script>

<style lang="scss">
    .custom-checkbox {
        opacity: 0;
        z-index: -1;
        position: absolute;
        width: 20px;
        height: 20px;
    }

    .custom-checkbox+label {
        display: inline-flex;
        user-select: none;
        align-items: center;
        column-gap: 7px;
    }

    .custom-checkbox+label::before {
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background: #FFFFFF;
        border: 1px solid #CDD1E0;
        background-color: #FFFFFF;
        background-size: 50% 50%;
        background-repeat: no-repeat;
        background-position: center center;
        flex-shrink: 0;
        flex-grow: 0;
    }

    .custom-checkbox:checked+label::before {
        background-image: url("data:image/svg+xml,%3Csvg width='14' height='11' viewBox='0 0 14 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4L4.28131 8.92197C4.64475 9.46712 5.42549 9.52133 5.86077 9.03163L13 1' stroke='%23000C14' stroke-width='2'/%3E%3C/svg%3E");
    }
</style>