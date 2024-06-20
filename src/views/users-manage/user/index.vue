<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入用户名称" style="max-width: 180px"  v-model="search_username"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchUsers">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增用户
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickname" label="用户昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="gender" label="性别" show-overflow-tooltip></el-table-column>
				<el-table-column prop="birth" label="生日" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
				<el-table-column prop="profession" label="职业" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nation" label="国籍" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="用户状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row === scope.row">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
<!--				<el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column>-->
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[30]"
				v-model:current-page="state.tableData.param.pageNum"
				background
				v-model:page-size="state.tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup name="allusers">
import {defineAsyncComponent, onActivated, onMounted, ref} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from '/@/utils/request'

// 用户搜索
const search_username = ref('')
const searchUsers = async () => {
	state.value.tableData.loading = true;
	const res = await request.get(`/search/getUsersResultsPages?search_key=${search_username.value}&page=${state.value.tableData.param.pageNum}`)
	state.value.tableData.data = res.data;
	console.log(res)
	const res1 = await request.get(`/search/getUsersSearchPages?search_key=${search_username.value}`)
	state.value.tableData.total = res1.data[0].cnt
	state.value.tableData.loading = false;
}

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/src/views/users-manage/user/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = ref({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 30,
		},
	},
});

const updateTotal = async () => {
	const res = await request.get('/userinfo/getUserMaxPage')
	console.log(res)
	state.value.tableData.total = parseInt(res.data[0].cnt);
}

// 初始化表格数据
const getTableData = async () => {
	state.value.tableData.loading = true;
	const res = await request.get(`/userinfo/getAllUserInfo?page=${state.value.tableData.param.pageNum}`)
	state.value.tableData.data = res.data;
	// eslint-disable-next-line no-console
	state.value.tableData.loading = false;
};
// 打开新增用户弹窗
const onOpenAddUser = (type) => {
	userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type, row) => {
	userDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await request.post(`/admin/deleteUser?username=${row.username}`)
			getTableData();
			ElMessage.success(res.message);
		})
		.catch(() => {});
};
// 分页改变
const onHandleSizeChange = (val) => {
	state.value.tableData.param.pageSize = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val) => {
	state.value.tableData.param.pageNum = val;
	getTableData();
};
// 页面加载时
onMounted(() => {
	updateTotal()
	getTableData();
});

onActivated(()=> {
	updateTotal()
	getTableData();
})
</script>

<style scoped lang="scss">
.system-user-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
		.el-table {
			flex: 1;
		}
	}
}
</style>
