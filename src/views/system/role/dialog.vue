<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="标题">
							<el-input v-model="state.ruleForm.title" placeholder="请输入标题" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="时间">
							<el-input v-model="state.ruleForm.time" placeholder="请输入时间（2023-8-19）" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-input
					v-model="state.ruleForm.content"
					:autosize="{ minRows: 2, maxRows: 20 }"
					type="textarea"
					placeholder="输入通知内容"
			/>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="systemRoleDialog">
import { reactive, ref } from 'vue';
import request from '/@/utils/request'
import {ElMessage} from "element-plus";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const roleDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		title: '',
		time: '',
		content: ``,
	},
	menuData: [],
	menuProps: {
		children: 'children',
		label: 'label',
	},
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
		state.ruleForm = row;
		state.dialog.title = '修改通知';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增通知';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	roleDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = async () => {
	const res = await request.post('/admin/addNews', { title: state.ruleForm.title, time: state.ruleForm.time,
																																	content: state.ruleForm.content})
	ElMessage.info(res.message)
	closeDialog();
	state.ruleForm.title = ''
	state.ruleForm.time = ''
	state.ruleForm.content =  ``
	emit('refresh');
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
