import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useMemoStore = defineStore(
	'dd-memo',
	() => {
		const content = ref(``)
		const setContent = (newContent) => {
			content.value = newContent
		}

		return {
			content,
			setContent,
		}
	},
	{
		persist: true
	}
)
