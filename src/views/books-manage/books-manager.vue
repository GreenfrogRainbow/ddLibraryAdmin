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
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增图书
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="id" label="ID" show-overflow-tooltip width="100" />
				<el-table-column prop="title" label="书名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="scor" label="评分" show-overflow-tooltip></el-table-column>
				<el-table-column prop="author" label="作者" show-overflow-tooltip></el-table-column>
				<el-table-column prop="price" label="价格" show-overflow-tooltip></el-table-column>
				<el-table-column prop="time" label="出版时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="publish" label="出版社" show-overflow-tooltip></el-table-column>
				<el-table-column prop="yizhe" label="译者" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ISBN" label="ISBN" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row === scope.row">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
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
					:page-sizes="[25]"
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

<script setup name="allbooks">
import {defineAsyncComponent, onActivated, onMounted, ref} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from '/@/utils/request'

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/src/views/books-manage/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = ref({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 25,
		},
	},
});

const search_book_title = ref('')
const searchBooks = async () => {
	state.value.tableData.loading = true;
	const res = await request.get(`/search/getBooksResultsPages?search_key=${search_book_title.value}&page=${state.value.tableData.param.pageNum}`)
	state.value.tableData.data = res.data;
	const res1 = await request.get(`/search/getSearchPages?search_key=${search_book_title.value}`)
	state.value.tableData.total = res1.data[0].cnt
	state.value.tableData.loading = false;
}

const updateTotal = async () => {
	const res = await request.get('/recommend/getMaxPageNum')
	state.value.tableData.total = parseInt(res.data[0].cnt);
}

// 初始化表格数据
const getTableData = async () => {
	state.value.tableData.loading = true;
	const res = await request.get(`/recommend/getAllBooks?page=${state.value.tableData.param.pageNum}`)
	state.value.tableData.data = res.data;
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
	ElMessageBox.confirm(`此操作将永久删除书籍：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await request.post(`/admin/deleteBook?id=${row.id}`)
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
