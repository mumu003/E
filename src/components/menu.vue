<template>
    <div style="background:#495060" class="ivu-shrinkable-menu">
      	<slot name="top"></slot>
      	<sidebar-menu
            v-show="!shrink"
            :menu-list="menuList"
            @on-change="handleChange"
        ></sidebar-menu>
        <sidebar-menu-shrink
            v-show="shrink"
            :menu-list="menuList"
            icon-color="#fff"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
	import './../assets/css/menu.css'    // 使用 CSS
    import sidebarMenu from './menu-component/sidebarMenu.vue';
    import sidebarMenuShrink from './menu-component/sidebarMenuShrink.vue';
    export default {
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        beforePush: {
            type: Function
        },
    },
    methods: {
      handleChange(name){
      	// this.$emit('on-change', name);
      }
    }
    }
</script>
