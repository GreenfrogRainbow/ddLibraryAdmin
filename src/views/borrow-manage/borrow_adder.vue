<template>
	<div class="addBorrow" v-loading="borrowForm.loading">
		<div class="borrow-body">
			<el-form
					ref="form"
					:model="borrowForm"
					label-width="auto"
					label-position="top"
					size="large"
			>
				<el-form-item label="ISBN">
					<div class="subItems">
						<el-input v-model="borrowForm.ISBN" />
						<el-button type="primary" @click="getBookID">获取ID</el-button>
					</div>
				</el-form-item>
				<el-form-item label="图书ID">
					<div class="subItems">
						<el-input v-model="borrowForm.book_id" disabled />
					</div>
				</el-form-item>
				<el-form-item label="用户名">
					<div class="subItems">
						<el-input v-model="borrowForm.username" />
						<el-button type="primary" @click="getUserID">获取用户ID</el-button>
					</div>
				</el-form-item>
				<el-form-item label="用户ID">
					<div class="subItems">
						<el-input v-model="borrowForm.user_id" disabled />
					</div>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="onSubmit">添加</el-button>
					<el-button>Cancel</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>

</template>

<script setup>
import { ref } from 'vue'
import request from '/@/utils/request'
import {ElMessage} from "element-plus";

const borrowForm = ref({
	ISBN: '',
	book_id: '',
	user_id: '',
	username: '',
	loading: false,
	borrow_time: 0
})

const getBookID = async () => {
	const res = await request.get(`/borrow/getBookID?ISBN=${borrowForm.value.ISBN}`)
	borrowForm.value.book_id = res.data.id
}

const getUserID = async () => {
	const res = await request.get(`/borrow/getUserID?username=${borrowForm.value.username}`)
	borrowForm.value.user_id = res.data.id
}

const onSubmit = async ()=> {
	borrowForm.value.loading = true
	borrowForm.value.borrow_time = Date.now()
	const res = await request.post('/borrow/addBorrowInfo', {
		borrow_time: borrowForm.value.borrow_time,
		book_id: borrowForm.value.book_id,
		borrower_id: borrowForm.value.user_id,
		borrow_stauts: 0
	})
	console.log(res)
	borrowForm.value.ISBN = ''
	borrowForm.value.book_id = ''
	borrowForm.value.user_id = ''
	borrowForm.value.username = ''
	borrowForm.value.loading = false
	ElMessage.success('添加成功')
}
</script>

<style scoped>
.addBorrow{
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
}

.borrow-body {
	margin-top: 60px;
	width: 70%;
	height: 100%;
}

.subItems {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}

</style>
