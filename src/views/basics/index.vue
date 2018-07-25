<!--<template>
 <div>基础设置</div>
</template>

<script>
export default {
  name: 'basics'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>-->
<template>
  <div class="topic-select">
    <div class="cell" v-for="(topic,index) in topic_list" @click="updateCount(index)" :class="{'highlight':topic.seen}">
      <svg    class="topic_icon" :style="{'background-color':topic.bgc}"></svg>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        topic_list: [
          { name: 'agriculture', bgc: '#ea5545', count: 456, seen: false },
          { name: 'biodiversity', bgc: '#27aeef', count: 7989, seen: false },
          { name: 'climate', bgc: '#87bc45', count: 123, seen: false },
          { name: 'disaster', bgc: '#f46a9b', count: 56, seen: false },
          { name: 'energy', bgc: '#7c4dff', count: 9089, seen: false },
          { name: 'ecosystems', bgc: '#bdcf32', count: 322, seen: false },
          { name: 'geology', bgc: '#b33dc6', count: 1456, seen: false },
          { name: 'health', bgc: '#ef9b20', count: 6789, seen: false },
          { name: 'water', bgc: '#27aeef', count: 4356, seen: false },
          { name: 'weather', bgc: '#edbf33', count: 7890, seen: false }
        ]
      }
    },
    methods: {
      updateCount: function (index) {
        this.topic_list[index].seen = !this.topic_list[index].seen
      }
    }
  }

</script>
<style>
  .highlight{
    opacity: 0;
  }
</style>




