import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '../pages/NotFound.vue';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: () => import('../pages/Home.vue'),
		},
		{
			path: '/about',
			component: () => import('../pages/About.vue'),
		},
		{
			path: '/experience',
			component: () => import('../pages/Experience.vue'),
		},
		{
			path: '/education',
			component: () => import('../pages/Education.vue'),
		},
		{
			path: '/contacts',
			component: () => import('../pages/ContactMe.vue'),
		},
		{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
	],
});
