import { createRouter, createWebHistory } from "vue-router"; 
import UserLocation from '../pages/UserLocation.vue'


const routes = [
    {
        path: "/",
        name: "UserLocation",
        component: UserLocation,
    },
    
];

export default createRouter({
    routes,
    history: createWebHistory()
});