<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入图书名称" style="max-width: 180px" v-model="search_book_title"> </el-input>
				<el-button size="default" type="primary" class="ml10"  @click="searchBooks">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="borrow_id" label="借阅号" show-overflow-tooltip width="100" />
				<el-table-column prop="title" label="书名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="borrow_time" label="借出时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="return_time" label="归还时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="借阅状态" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
						>修改</el-button
						>
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">还书</el-button>
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

<script setup name="allborrow">
import { defineAsyncComponent, onMounted, ref, onActivated } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from '/@/utils/request'
import {changeMode, preChangeMode} from '/@/utils/moment'

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

const search_book_title = ref('')
const searchBooks = () => {

}

const borrow_status = ['正在借阅','正常归还','过期归还','延期阅读']

const updateTotal = async () => {
	const res = await request.get('/borrow/getBorrowMaxPage')
	state.value.tableData.total = parseInt(res.data.cnt);
}

// 初始化表格数据
const getTableData = async () => {
	state.value.tableData.loading = true;
	const res = await request.get(`/borrow/getBorrowInfoTable?page=${state.value.tableData.param.pageNum}`)
	state.value.tableData.data = res.data;
	for( let i =0; i< state.value.tableData.data.length; i++) {
		if(state.value.tableData.data[i].return_time !== null) {
			state.value.tableData.data[i].return_time = changeMode(state.value.tableData.data[i].return_time)
		}
		if( state.value.tableData.data[i].status === '0') {
			state.value.tableData.data[i].return_time = preChangeMode(state.value.tableData.data[i].borrow_time, 0)
		}
		if(state.value.tableData.data[i].status === '3') {
			state.value.tableData.data[i].return_time = preChangeMode(state.value.tableData.data[i].borrow_time, 3)
		}
		state.value.tableData.data[i].status = borrow_status[parseInt(state.value.tableData.data[i].status)]
		state.value.tableData.data[i].borrow_time = changeMode(state.value.tableData.data[i].borrow_time)
	}
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
// 还书
const onRowDel = (row) => {
	ElMessageBox.confirm(`确定为：“${row.username}”办理还书吗，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const dateInt = Date.now()
			const res = await request.post(`/admin/returnBook?borrow_id=${row.borrow_id}&return_time=${dateInt}&borrow_status=${1}`)
			getTableData();
			ElMessage.success(res.message);
		})
		.catch(() => {});
};
// 分页改变
const onHandleSizeChange = async (val) => {
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
