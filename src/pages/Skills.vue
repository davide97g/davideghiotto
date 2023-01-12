<template>
	<div class="h100">
		<h1 class="fade-in txt">Skills</h1>
		<div
			style="
				display: flex;
				justify-content: space-around;
				align-items: center;
				flex-wrap: wrap;
				gap: 12px;
			"
		>
			<div
				v-for="(tech, index) in techSkills"
				:key="index"
				class="left card glass solid flex-center flex-column"
			>
				<a-row class="w100">
					<a-col :span="18">
						{{ tech.name }}
					</a-col>
					<a-col :span="6"> {{ tech.years }} years </a-col>
				</a-row>
				<a-row class="w100 small">
					{{ tech.description }}
				</a-row>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const techSkills = [
	{
		name: 'Vuejs',
		years: '2',
		description: 'Webapp',
	},
	{
		name: 'Angular',
		years: '2',
		description: 'Webapp',
	},
	{
		name: 'HTML/CSS/Javascript',
		years: '4',
		description: 'Webapp',
	},
];
</script>
