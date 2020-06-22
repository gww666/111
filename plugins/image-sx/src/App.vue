<template>
	<div id="app">
		<image-x @fileChange="fileChange" mode="preview" :imgUrls="imgs"></image-x>
		<image-x @fileChange="fileChange" mode="preview" :imgUrls="imgs"></image-x>
		<image-x-mobile @fileChange="fileChange1" mode="data" slotName="add">
			<template v-slot:add="{addProps}">
				<div @click="addProps.click">
					这是自定义的按钮1
				</div>
			</template>
		</image-x-mobile>
		<image-x-mobile @fileChange="fileChange2" mode="data" slotName="add">
			<template v-slot:add="{addProps}">
				<div @click="addProps.click">
					这是自定义的按钮2
				</div>
			</template>
		</image-x-mobile>
	</div>
</template>

<script>
import ImageX from "./lib/index.vue";
import ImageXMobile from "./lib/mobile.vue";
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
		},
		fileChange1(arr) {
			console.log("1", arr);
		},
		fileChange2(arr) {
			console.log("2", arr);
		}
	},
	components: {
		ImageX,
		ImageXMobile
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
