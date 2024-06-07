import axios from "axios";
import {ElMessage} from "element-plus";

export const ossUploadService = async (item, callback = (ossData) => {}, generateFileName = (ossData, file) => {}) => {
    await axios.get('http://localhost:3000/oss/signature').then(async (res) => {
        ElMessage({
            type: "info",
            message: res.data.message
        })
        const ossData = res.data;
        const file = item.image[0]
        //生成文件名作为key
        const key = await generateFileName(ossData, file)

        const formData = new FormData()

        // 注意参数的顺序，key 必须是第一位，表示OSS存储文件的路径
        formData.append('key', key)
        formData.append('OSSAccessKeyId', ossData.accessId)
        formData.append('policy', ossData.policy)
        formData.append('signature', ossData.signature)
        // 文件上传成功默认返回 204 状态码，可根据需要修改为 200
        formData.append('success_action_status', '200')
        // file 必须放在最后一位
        formData.append('file', item.image[0].raw)

        await axios.post(ossData.host, formData).then((res) => {
            if (res.status === 200) {
                ElMessage({
                    type: "info",
                    message: '上传成功'
                })
            }
        }).catch((err) => {
            console.log(err)
        })
        //注入持久化函数
        const rollBack = async () => {
            await callback(ossData) //
            console.log('执行回调函数')
        }
        await rollBack()
    }).catch((err) => {
        console.log(err)
    })
}