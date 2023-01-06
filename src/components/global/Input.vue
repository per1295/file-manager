<template>
    <div class="custom-input" :data-type="type">
        <input
            @input="updateValue($event, $emit)"
            :type="computedType"
            :name="name"
            class="custom-input"
            :class="[className, theme === 'light' ? 'light-theme cursor-pointer-light' : 'dark-theme cursor-pointer-dark']"
            :id="id"
            :maxLength="maxLength"
            :minLength="minLength"
            :required="required"
            :placeholder="placeholder"
            :value="inputValue"
            autocomplete="off"
            data-cursor="pointer"
        >
        <component
            :is="type === 'password' ? passwordComponent : null"
            :set-is-show-password="setIsShowPassword"
            :class="[theme === 'light' ? 'cursor-pointer-light' : 'cursor-pointer-dark']"
            data-cursor="pointer"
        />
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import { computed, ref, toRefs } from '@vue/reactivity';
    import { updateValue } from '../../functions';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    import ShowPasswordVue from "./ShowPassword.vue";
    import UnShowPasswordVue from "./UnShowPassword.vue";

    defineEmits([
        "update:email",
        "update:password",
        "update:username",
        "update:tel"
    ]);

    const props = defineProps({
        name: {
            type: String as PropType<string>,
            required: true
        },
        required: {
            type: Boolean as PropType<boolean>,
            default: true
        },
        type: {
            type: String as PropType<string>,
            default: "text"
        },
        id: {
            type: String as PropType<string>
        },
        minLength: {
            type: Number as PropType<number>
        },
        maxLength: {
            type: Number as PropType<number>
        },
        className: {
            type: String as PropType<string>
        },
        placeholder: {
            type: String as PropType<string>
        },
        email: {
            type: String as PropType<string>
        },
        password: {
            type: String as PropType<string>
        },
        username: {
            type: String as PropType<string>
        },
        tel: {
            type: String as PropType<string>
        }
    });

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    const isShowPassword = ref(false);
    const setIsShowPassword = () => isShowPassword.value = !isShowPassword.value;

    const { type, email, password, username, tel } = toRefs(props);

    const computedType = computed(() => (
        type.value === "password"
        ?
        isShowPassword.value
        ?
        "text"
        :
        "password"
        :
        type.value
    ));

    const inputValue = computed(() => (
        type.value === "email"
        ?
        email?.value
        :
        type.value === "password"
        ?
        password?.value
        :
        type.value === "text"
        ?
        username?.value
        :
        type.value === "tel"
        ?
        tel?.value
        :
        undefined
    ));

    const passwordComponent = computed(() => isShowPassword.value ? ShowPasswordVue : UnShowPasswordVue);
</script>

<style lang="scss">
    div.custom-input {
        width: 312px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.4);
        border-radius: 10px;

        &[data-type=password] {
            padding: 0 15.81px 0 10px;
        }

        &[data-type=password] > input.custom-input {
            padding-right: 10px;
        }

        input.custom-input {
            height: 100%;
            width: 100%;
            font-family: 'Poppins';
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.7);
            background-color: transparent;

            &::placeholder, &::-moz-placeholder, &::-webkit-input-placeholder {
                font-family: 'Poppins';
                font-weight: 400;
                font-style: normal;
                font-size: 16px;
                line-height: 24px;
                color: rgba(0, 0, 0, 0.7);
            }
        }
    }
</style>