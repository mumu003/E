<template>
	    <Icon :type="collapseType" @click.native="changeCollapse($event)" class="search-icon"></Icon>
</template>

<script type="text/javascript">
	export default{
		props:['foldPart','initFold'],
		data(){
			return {
				collapseType:"chevron-down",
				hasborder:true,
				noborder:false,
			}
		},
		mounted(){
			if (this.initFold) {
				 document.getElementsByClassName("initFold")[0].parentNode.style.display="none";
				 this.collapseType="chevron-up"
			}
		},
		methods:{
			changeCollapse(param){
				// console.log(param.target.parentNode.parentNode.nextElementSibling);
				if (this.collapseType=="chevron-down") {
					this.collapseType="chevron-up";
					// this.hasborder=false;
					// this.bordernone=true;
					param.target.parentNode.parentNode.nextElementSibling.style.display="none"
					// document.getElementsByClassName("ivu-card-body")[0].style.display="none";
					// document.getElementById(this.foldPart).style.display="none";
					return;
				}
				if (this.collapseType=="chevron-up") {
					this.collapseType="chevron-down";
					// this.hasborder=true;
					// this.bordernone=false;
					// document.getElementById(this.foldPart).style.display="block";
					param.target.parentNode.parentNode.nextElementSibling.style.display="block"
					// document.getElementsByClassName("ivu-card-body")[0].style.display="block";
					return;
				}
			}
		}
	}
</script>