import request from '/@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
	request.post('/api/regAdmin', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
	request.post('/api/loginAdmin', { username, password })

// 获取用户基本信息
export const userGetInfoService = () => request.get('/api/getAdminInfo')
