import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: () => import('../pages/Home.vue'),
		},
		{
			path: '/contacts',
			component: () => import('../pages/Contacts.vue'),
		},
		{
			path: '/projects',
			component: () => import('../pages/Projects.vue'),
		},
		{
			path: '/skills',
			component: () => import('../pages/Skills.vue'),
		},
		{ path: '/:pathMatch(.*)*', redirect: '/' },
	],
});
