<template>
    <div class="form-main-wrapper">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .form-main-wrapper {
        margin-top: 19px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        row-gap: 6px;
    }
</style>