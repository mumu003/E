<template>
    
    <div>
        <Menu ref="sideMenu" active-name="" :open-names="['1']" theme="dark" width="auto">
            <template v-for="(item,index) in menuList">
                
                <!-- &&(auths.indexOf(item.code)!=-1) -->
                <MenuItem v-if="item.childList==null" :name="(index+1)" :key="item.id" @click.native="routeTo(item.url)"  :id="item.url">
                    <Icon :type="item.icon"  :key="'menuicon' + item.id"></Icon>
                    <span class="layout-text" :key="'title' + item.id">{{item.name}}</span>
                </MenuItem>

                <Submenu v-if="item.childList!=null" :name="(index+1)" :key="item.id">
                    <template slot="title">
                        <Icon :type="item.icon"></Icon>
                        <span class="layout-text">{{item.name}}</span>
                    </template>
                    <template v-for="(child,cid) in item.childList" v-if="auths.indexOf(child.code)!=-1">
                        <MenuItem :name="(index+1)+'-'+(cid+1)" :key="'menuitem' + child.id" @click.native="routeTo(child.url)"  :id="child.url">
                            <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.id"></Icon>
                            <span class="layout-text" :key="'title' + child.id">{{child.name}}</span>
                        </MenuItem>
                    </template>
                </Submenu>
            </template>
        </Menu>
    </div>
</template>

<script>
import './../../assets/css/menu.css'    // 使用 CSS 
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
    },
    data:function(){
        return{
              auths:[],
        }
    },
    methods: {
    routeTo(url){
        if(url=='/workOrder')
        sessionStorage.removeItem('paramsstatus')
        for(let value of document.getElementsByClassName("ivu-menu-vertical")[0].querySelectorAll('.ivu-menu-item')){
           if (value.classList.contains("ivu-menu-item-active")) {
                value.classList.remove('ivu-menu-item-active');
                value.classList.remove('ivu-menu-item-selected');
           };
        };
        if (document.getElementById(url.split("?")[0])!=null) {
          document.getElementById(url.split("?")[0]).classList.add("ivu-menu-item-selected");
          document.getElementById(url.split("?")[0]).classList.add("ivu-menu-item-active");
        }
        this.$router.push(url)
    },
    },
    created(){
        var auths=JSON.parse(sessionStorage.getItem('auth'));
        for(var i in auths){
          this.auths.push(i);
        }
      
        // console.log(this.menuList);
    },
};
</script>
