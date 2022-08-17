type TestResult = {
    result: boolean;
    message: string;
}

export function emailTest(email: string): TestResult {
    const emailRe = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!emailRe.test(email)) {
        return {
            result: false,
            message: '不是有效的邮箱'
        }
    }
    const jgsuRe = new RegExp('@jgsu.edu.cn$');
    const ret = jgsuRe.test(email);
    if (ret) {
        if (email.split('@')[0].length === 10) {
            return {
                result: true,
                message: '格式正确'
            }
        } else {
            return {
                result: false,
                message: '学号长度不正确'
            }
        }
    } else {
        return {
            result: false,
            message: '请使用 @jgsu.edu.cn'
        }
    }
}
