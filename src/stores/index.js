// https://pinia.vuejs.org/
import { createPinia } from 'pinia';
import persist from 'pinia-plugin-persistedstate'
// 创建
const pinia = createPinia();
pinia.use(persist)
// 导出
export default pinia;
export * from './userInfo'
export * from './memoStore'
