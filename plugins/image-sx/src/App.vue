<template>
	<div id="app">
		<image-x @fileChange="fileChange" mode="preview" :imgUrls="imgs"></image-x>
		<image-x @fileChange="fileChange" mode="preview" :imgUrls="imgs"></image-x>
	</div>
</template>

<script>
import ImageX from "./lib/index.vue";
export default {
	name: "app",
	data() {
		return {
			imgs: []
		}
	},
	methods: {
		fileChange(arr) {
			console.log("arr", arr);
		}
	},
	components: {
		ImageX
	},
	mounted() {
		setTimeout(() => {
			this.imgs = ["http://120.78.221.14:2233/public/upload/75909acdca7d6c9a9fd453c9f80a8472.jpeg", "http://120.78.221.14:2233/public/upload/75909acdca7d6c9a9fd453c9f80a8472.jpeg"];
		}, 1000);
	}
	
};
</script>

<style>
* {
	padding: 0;
	margin: 0;
}
</style>
