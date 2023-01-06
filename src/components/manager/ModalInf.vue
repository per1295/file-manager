<template>
    <span class="modal-inf">
        <slot></slot>
    </span>
</template>

<style lang="scss">
    .modal-inf {
        max-width: 100%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        text-align: center;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
    }
</style>