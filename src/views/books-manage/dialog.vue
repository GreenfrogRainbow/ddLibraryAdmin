<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="书籍名">
							<el-input v-model="state.ruleForm.title" placeholder="请输入书籍名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="作者">
							<el-input v-model="state.ruleForm.author" placeholder="请输入作者" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="价格">
							<el-input v-model="state.ruleForm.price" placeholder="请输入价格" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="出版时间">
							<el-input v-model="state.ruleForm.time" placeholder="请输入出版时间(2002-12)" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="出版社">
							<el-input v-model="state.ruleForm.publish" placeholder="请输入出版社" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="译者">
							<el-input v-model="state.ruleForm.yizhe" placeholder="书籍译者，非必选~" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="ISBN">
							<el-input v-model="state.ruleForm.ISBN" placeholder="请输入ISBN" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="书籍状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="简介">
							<el-input v-model="state.ruleForm.brief" placeholder="请输入简介" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
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
					</el-col>

				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="systemUserDialog">
import { ref } from 'vue';
import request from '/@/utils/request'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const state = ref({
	ruleForm: {
		title: '',
		author:'',
		price: '',
		time: '',
		publish:'',
		yizhe: '',
		brief:'',
		ISBN: '',
		status: true, // 用户状态
	},
	deptData: [], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type, row) => {
	if (type === 'edit') {
		state.value.ruleForm = row;
		state.value.dialog.title = '修改用户';
		state.value.dialog.submitTxt = '修 改';
	} else {
		state.value.dialog.title = '新增用户';
		state.value.dialog.submitTxt = '新 增';
	}
	state.value.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.value.ruleForm.title= ''
	state.value.ruleForm.author = ''
	state.value.ruleForm.price = ''
	state.value.ruleForm.time = ''
	state.value.ruleForm.publish = ''
	state.value.ruleForm.yizhe = ''
	state.value.ruleForm.brief = ''
	state.value.ruleForm.ISBN = ''
	imageUrl.value = ''
	state.value.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = async () => {
	await request.post('/admin/addNewBook', { 	title: state.value.ruleForm.title,
																												author: state.value.ruleForm.author,
																												price: state.value.ruleForm.price,
																												time: state.value.ruleForm.time,
																												publish: state.value.ruleForm.publish,
																												yizhe: state.value.ruleForm.yizhe,
																												brief: state.value.ruleForm.brief,
																												ISBN: state.value.ruleForm.ISBN,
																												picLink: imageUrl.value} )
	closeDialog();
	emit('refresh');
};
// 图片
const imageUrl = ref('')
const onSelectFile = (uploadFile) => {
	// 图片预览1
	// imageUrl.value = URL.createObjectURL(uploadFile.raw)
	// 图片预览2
	const reader = new FileReader()
	reader.readAsDataURL(uploadFile.raw)

	reader.onload = () => {
		imageUrl.value = reader.result
	}
}

// 暴露变量
defineExpose({
	openDialog,
});


</script>
