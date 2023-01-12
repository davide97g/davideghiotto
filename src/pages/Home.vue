<template>
	<div
		class="h100"
		style="display: flex; flex-direction: column; align-items: center; justify-content: center"
	>
		<img src="../assets/img/davide.jpg" alt="me" height="100" class="avatar fade-in" />
		<h2 class="fade-in txt">
			Welcome... <br />
			to my personal website
		</h2>
		<h3 class="fade-in delay-1 txt">Let's get to know each other.</h3>
		<a-divider />
		<div
			class="w100"
			style="
				display: flex;
				justify-content: space-around;
				align-items: center;
				flex-wrap: wrap;
				gap: 12px;
			"
		>
			<div class="card glass flex-center fade-in delay-2">
				<router-link to="/skills">
					<a-button type="link"><ToolOutlined /> Skills</a-button>
				</router-link>
			</div>
			<div class="card glass flex-center fade-in delay-3">
				<router-link to="/projects">
					<a-button type="link"><ProjectOutlined /> Projects</a-button>
				</router-link>
			</div>
			<div class="card glass flex-center fade-in delay-4">
				<router-link to="/contacts">
					<a-button type="link"><MailOutlined /> Contacts</a-button>
				</router-link>
			</div>
		</div>
		<a-divider />
		<a-button class="fade-in delay-5" type="primary" @click="isCVHighlighted = !isCVHighlighted"
			>"I just need the CV"</a-button
		>
	</div>
</template>

<script setup lang="ts">
import { ProjectOutlined, ToolOutlined, MailOutlined } from '@ant-design/icons-vue';
import { isCVHighlighted } from '../services/utils';
</script>

<style scoped lang="scss">
.avatar {
	border-radius: 100%;
	margin: 20px;
	border: 3px solid white;
}
</style>
