import { defineStore } from 'pinia';
import { ref } from 'vue'
import {userGetInfoService} from "/@/api/login";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo',
	()=>{
		const userInfos = ref({})
		const userRole = ref({
			roles: '',
			authBtnList: ''
		})
		const token = ref(``)

		const setToken = (newToken) => {
			token.value = newToken
		}
		const setUserInfos = async() => {
			// 存储用户信息到浏览器缓存
			await getApiUserInfo();
		}
		const getApiUserInfo = async() => {
			const res = await userGetInfoService()
			userInfos.value = res.data
			// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
			let adminRoles = ['admin'];
			// admin 按钮权限标识
			let adminAuthBtnList = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
			// 不同用户模拟不同的用户权限
			userRole.value.roles = adminRoles
			userRole.value.authBtnList = adminAuthBtnList
		}
		return {
			userInfos,
			setUserInfos,
			getApiUserInfo,
			token,
			setToken,
			userRole
		}
	},
	{
		persist: true
	}
);
