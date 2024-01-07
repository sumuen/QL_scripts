const UAs = [
    'iPhone;3.7.0;14.4;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
    'Rajax/1 Apple/iPhone9,2 iOS/14.8.1 Eleme/11.0.8 ID/50E26F2E-64B8-46BE-887A-25F7BEB4D762; IsJailbroken/1 Mozilla/5.0 (iPhone; CPU iPhone OS 14_8_1 like Mac OS X) AppleWebKit/605.1.15'
];
const got = require("got")
const {
    getEnvs,
    getEnvById,
    DisableCk,
    EnableCk,
    getstatus
} = require('./ql');
// testCookie 函数定义
async function testCookie(cookie) {
    const UA = UAs[Math.floor(Math.random() * UAs.length)];
    const options = {
        method: 'GET',
        url: 'https://restapi.ele.me/eus/v5/user_detail',
        headers: {
            Cookie: cookie,
            'user-agent': UA,
            host: 'restapi.ele.me',
        },
    };

    try {
        const response = await got(options);
        const responseBody = JSON.parse(response.body);
        console.log(response.body)
        return responseBody;
    } catch (error) {
        // 检查 error.response 是否存在
        if (error.response && error.response.body) {
            const errorBody = JSON.parse(error.response.body);
            if (errorBody.name === "UNAUTHORIZED") {
                console.log("未登录，跳过该账号");
            } else {
                console.log(error.response.body);
            }
        } else {
            // 如果 error.response 不存在，打印错误信息
            console.log('请求失败，无法获取有效响应:', error.message);
        }
        return false;
    }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    const envs = await getEnvs();
    //console.log(envs)
    console.log(`\n==================== 共${envs.length}个饿了么账号Cookie ====================\n`)
    console.log(`============ 脚本执行 - 北京时间(UTC+8) ${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()} ============\n`)
    for (let i = 0; i < envs.length; i++) {
        if (envs[i].value) {
            var tempid = 0;
            if (envs[i]._id) {
                tempid = envs[i]._id;
            }
            if (envs[i].id) {
                tempid = envs[i].id;
            }
            cookie = await getEnvById(tempid);
            // 调用 testCookie
            testCookie(cookie).then(response => {
                if (response) {
                    EnableCk(tempid)
                    console.log('Cookie 验证成功:', envs[i].remarks);
                } else {
                    DisableCk(tempid)
                    console.log('Cookie 验证失败:', envs[i].remarks);
                }
            });

            // 在每次请求后等待一秒
            await delay(1000);
        }
    }
}
main()