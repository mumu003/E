<template>
  <div class="layout-nav layout-bread">
    <div class="bar-content">
      <Tag type="dot" v-if="isCurrent('/')" color="blue" name="首页" @click.native="routeTo('/')">首页</Tag>
      <Tag type="dot" v-else="isCurrent('/')" name="首页" @click.native="routeTo('/')">首页</Tag>

      <div :to="item.link" v-for="(item,index) in items">
        <Tag type="dot" v-if="isCurrent(item.link)" color="blue" :name="item.title" closable
             @click.native="routeTo(item.link)"
             @on-close="removeItem">{{item.title}}
        </Tag>
        <Tag type="dot" v-else :name="item.title" closable @click.native="routeTo(item.link)" @on-close="removeItem">
          {{item.title}}
        </Tag>
      </div>
    </div>
    <div class="bar-tool">
      <Dropdown style="margin-left: 20px">
        <Button type="primary" size="small">
          标签选项
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="closeOther">关闭其他</DropdownItem>
          <DropdownItem @click.native="closeAll">关闭所有</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        initItems: [],
      }
    },
    computed: {
      items: function () {
        let item = {}, flag = true
        if (this.$route.path != "/") {
          this.initItems.forEach((v) => {
            if (this.$route.meta.title == v.title) {
              flag = false
            }
          })
          if (flag) {
            item.link = this.$route.path
            var routeQuery = this.$route.query
            if ((routeQuery != null) && (routeQuery != undefined)) {
              var num = 0
              for (var key in routeQuery) {
                if (num == 0) {
                  item.link = item.link + "?" + key + "=" + routeQuery[key]
                } else {
                  item.link = item.link + "&" + key + "=" + routeQuery[key]
                }
                num++
              }
            }
            item.title = this.$route.meta.title
            this.initItems.push(item)
          }
        }
        return this.initItems
      }
    },
    methods: {
      isCurrent(url){
        return url == this.$route.path
      },
      routeTo(url){
        for (let value of document.getElementsByClassName("ivu-menu-vertical")[0].querySelectorAll('.ivu-menu-item')) {
          if (value.classList.contains("ivu-menu-item-active")) {
            value.classList.remove('ivu-menu-item-active')
            value.classList.remove('ivu-menu-item-selected')
          }

        }

        if (document.getElementById(url.split("?")[0]) != null) {
          document.getElementById(url.split("?")[0]).classList.add("ivu-menu-item-selected")
          document.getElementById(url.split("?")[0]).classList.add("ivu-menu-item-active")
        }
        this.$router.push(url)
      },
      removeItem(event, name){
        if (this.initItems.length == 1) {
          for (let value of (document.querySelectorAll('.ivu-menu-item'))) {
            if (value.classList.contains('ivu-menu-item-active')) {
              value.classList.remove('ivu-menu-item-active')
              value.classList.remove('ivu-menu-item-selected')
            }
          }
          this.initItems.splice(0, 1)
          this.$router.push('/')
          return
        }

        let index = 0;
        this.initItems.forEach((item, i) => {
          if (item.title == name)
            index = i
        })

        if (this.initItems[index].link == this.$route.path) {
          for (let value of (document.querySelectorAll('li'))) {
            if (value.classList.contains('ivu-menu-item-active')) {
              value.classList.remove('ivu-menu-item-active')
              value.classList.remove('ivu-menu-item-selected')
            }
          }
          this.initItems.splice(index, 1)
          if (index == 0) {
            this.$router.push('/')
          } else {
            document.getElementById(this.initItems[index - 1].link.split("?")[0]).classList.add("ivu-menu-item-selected")
            document.getElementById(this.initItems[index - 1].link.split("?")[0]).classList.add("ivu-menu-item-active")
            this.$router.push(this.initItems[index - 1].link)
          }
        } else {
          this.initItems.splice(index, 1)
        }
      },
      closeOther(){
        this.initItems.forEach((item, i) => {
          if (item.link != this.$route.path)
            this.initItems.splice(i)
        })
      },
      closeAll(){
        this.initItems = []
        this.$router.push('/')
      }
    },
  }
</script>
<style scoped>
  .layout-bread {
    background: #f0f0f0;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    display: flex;
    height: 40px;
    position: relative;
  }

  .bar-content {
    width: 90%;
    display: flex;
  }

  .bar-tool {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 8px;
    text-align: center;
    /*width: 110px;*/
    height: 40px;
    background: #fff;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
    z-index: 10;
    padding-right: 10px;
  }

  .layout-bread-item {
    padding: 10px 0;

  }

  .demo-breadcrumb-separator {
    color: #2d8cf0;
    padding: 0 5px;
  }

  .layout-nav-item {
    margin-right: 20px;
  }

</style>
