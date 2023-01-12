import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: () => import('../pages/Home.vue'),
		},
		{
			path: '/contacts',
			name: 'Contacts',
			component: () => import('../pages/Contacts.vue'),
		},
		{
			path: '/projects',
			name: 'Projects',
			component: () => import('../pages/Projects.vue'),
		},
		{
			path: '/skills',
			name: 'Skills',
			component: () => import('../pages/Skills.vue'),
		},
		{ path: '/:pathMatch(.*)*', redirect: '/' },
	],
});
