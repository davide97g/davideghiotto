<template>
	<div id="cv-tooltip">
		<ArrowDownOutlined class="down move-y" v-if="highlightCV" />
		<ArrowRightOutlined class="right move-x" v-if="highlightCV" />
		<a-tooltip>
			<template #title> Download the CV </template>
			<a
				href="https://drive.google.com/file/d/1bQ8iiiqqE71MFrTclb81DAbx8F5zOljU/view?usp=share_link"
				target="_blank"
				class="fade-in delay-2"
			>
				<a-button type="primary" :class="{ glow: highlightCV }"
					><DownloadOutlined /> <FilePdfOutlined
				/></a-button>
			</a>
		</a-tooltip>
	</div>
</template>

<script setup lang="ts">
import {
	DownloadOutlined,
	FilePdfOutlined,
	ArrowDownOutlined,
	ArrowRightOutlined,
} from '@ant-design/icons-vue';
import { highlightCV } from '../services/utils';
</script>

<style scoped lang="scss">
#cv-tooltip {
	position: absolute;
	bottom: 20px;
	right: 5px;
	.right {
		position: absolute;
		left: -15px;
		top: 9px;
		bottom: 0;
	}
	.down {
		position: absolute;
		top: -15px;
		left: 0;
		right: 0;
		margin: auto;
	}
}

.move-x {
	animation: moveX 2s forwards ease-in-out;
	animation-fill-mode: both;
	animation-iteration-count: infinite;
}

@keyframes moveX {
	50% {
		-webkit-transform: translateX(-20px);
		-moz-transform: translateX(-20px);
		-ms-transform: translateX(-20px);
		-o-transform: translateX(-20px);
		transform: translateX(-20px);
	}
	100% {
		-webkit-transform: translateX(0px);
		-moz-transform: translateX(0px);
		-ms-transform: translateX(0px);
		-o-transform: translateX(0px);
		transform: translateX(0px);
	}
}

.move-y {
	animation: moveY 2s forwards ease-in-out;
	animation-fill-mode: both;
	animation-iteration-count: infinite;
}

@keyframes moveY {
	50% {
		-webkit-transform: translateY(-20px);
		-moz-transform: translateY(-20px);
		-ms-transform: translateY(-20px);
		-o-transform: translateY(-20px);
		transform: translateY(-20px);
	}
	100% {
		-webkit-transform: translateY(0px);
		-moz-transform: translateY(0px);
		-ms-transform: translateY(0px);
		-o-transform: translateY(0px);
		transform: translateY(0px);
	}
}

.glow {
	animation: glow 1.5s forwards ease-in-out;
	animation-fill-mode: both;
	animation-iteration-count: infinite;
}

@keyframes glow {
	50% {
		box-shadow: 0px 0px 25px 10px #32c0e4a8;
	}
	100% {
		box-shadow: none;
	}
}
</style>
