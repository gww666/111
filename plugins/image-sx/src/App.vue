<template>
	<div id="app">
		<image-x @fileChange="fileChange" mode="preview"></image-x>
	</div>
</template>

<script>
import ImageX from "./lib/index.vue";
export default {
	name: "app",
	methods: {
		fileChange(arr) {
			console.log("arr", arr);
		}
	},
	components: {
		ImageX
	},
	
};
</script>

<style>
* {
	padding: 0;
	margin: 0;
}
</style>
