import axios from "axios";
import {ElNotification} from "element-plus";

export const checkOrder = () => {
    //get access
    const access = localStorage.getItem('access').toString();
    axios.get('http://8.130.35.251:3005/order/recent', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
    }).then((res) => {
        if (res.data.code === 200) {
            ElNotification({
                title: '注意',
                message: res.data.message,
                type: 'warning',
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}