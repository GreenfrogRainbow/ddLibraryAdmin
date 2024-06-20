<template>
	<div class="addBorrow" v-loading="thisPageLoading">
		<div class="borrow-body">
			<el-form
					ref="form"
					:model="recommendSlideForm"
					label-width="auto"
					label-position="top"
					size="large"
			>
				<div class="items" v-for="(item, index) in recommendSlideForm" :key="item.id">
					封面{{ index+1 }}：
					<el-form-item label="ISBN">
						<div class="subItems">
							<el-input v-model="item.ISBN" />
							<el-button type="primary" @click="getBookID(item.ISBN, index)">获取ID</el-button>
						</div>
					</el-form-item>
					<el-form-item label="图书ID">
						<div class="subItems">
							<el-input v-model="item.book_id" disabled />
						</div>
					</el-form-item>
					<div class="uploadDiv">
						<el-upload
								ref="upload"
								class="avatar-uploader"
								:limit="1"
								:auto-upload="false"
								:on-change="onSelectFile"
						>
							<template #trigger>
								<el-button type="primary">上传封面图片</el-button>
							</template>
						</el-upload>
						<div class="deleteOne">
							<el-button type="primary" @click="deleteOne(index)">删除该项</el-button>
						</div>
					</div>
				</div>
				<el-form-item>
					<div class="submitButtons">
						<el-button type="primary" @click="onSubmit">更新</el-button>
						<el-button @click="addOne">新增</el-button>
					</div>
				</el-form-item>
			</el-form>
		</div>
	</div>

</template>

<script setup>
import {onMounted, ref} from 'vue'
import request from '/@/utils/request'
import {ElMessage} from "element-plus";

const recommendSlideForm = ref([])
const thisPageLoading = ref(false)
const imgUrl = ref([])
// 图片上传
const onSelectFile = (uploadFile) => {
	// 图片预览1
	// imageUrl.value = URL.createObjectURL(uploadFile.raw)
	// 图片预览2
	const reader = new FileReader()
	reader.readAsDataURL(uploadFile.raw)
	reader.onload = () => {
		imgUrl.value.push(reader.result)
	}
}
const getBookID = async (val, index) => {
	const res = await request.get(`/borrow/getBookID?ISBN=${val}`)
	recommendSlideForm.value[index].book_id = res.data.id
}


const onSubmit = async ()=> {
	thisPageLoading.value = true
	await request.post('/admin/deleteAllRecommend')
	for(let i=0; i< recommendSlideForm.value.length; i++) {
		const res = await request.post('/admin/updateRecommendSlide', {
			book_id: recommendSlideForm.value[i].book_id,
			ISBN: recommendSlideForm.value[i].ISBN,
			pic: imgUrl.value[i]
		})
	}
	ElMessage.info('更新成功')
	thisPageLoading.value = false
}
onMounted(async () => {
	const res = await request.get('/admin/getRecommendSlide')
	recommendSlideForm.value = res.data
	for(let i =0; i<recommendSlideForm.value.length;i++) {
		imgUrl.value.push(recommendSlideForm.value[i].pic)
	}
	recommendSlideForm.value.push({})
})
const addOne = () => {
	recommendSlideForm.value.push([])
}
const deleteOne = (val) => {
	recommendSlideForm.value.splice(val, 1)
	imgUrl.value.splice(val, 1)
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
.uploadDiv {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
}
.deleteOne {
	height: 100%;
}

.items {
	margin-top: 20px;
	border-bottom: black 1px solid;

}
.submitButtons {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	border-top: white 2px solid;
	margin-top: 30px;
	margin-bottom: 50px;
}

</style>
