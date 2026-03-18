import CryptoJS from 'crypto-js';

// 加密秘钥（建议从环境变量读取）
const SECRET_KEY = import.meta.env.VITE_ENCRYPT_SECRET_KEY;

/**
 * AES 加密
 * @param data 要加密的数据
 * @returns 加密后的数据
 */
export const encrypt = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

/**
 * AES 解密
 * @param data 要解密的数据
 * @returns 解密后的数据（如果失败返回空字符串）
 */
export const decrypt = (data: string): string => {
    try {
        return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    } catch (error) {
        console.error('AES 解密失败:', error)
        return ''
    }
}

/**
 * 
 * @param account 存储记住的凭证
 * @param password 
 * @param rememberMe 
 * @returns 
 */
export const saveCredentials = (account: string, password: string, rememberMe: boolean) => {
    if (!rememberMe) {
        clearRememberedCredentials()
        return
    }

    localStorage.setItem('remembered_account', account)
    // 密码一定要加密存储！
    localStorage.setItem('remembered_password', encrypt(password))
}

/**
 * 获取记住的凭证
 */
export const getRememberedCredentials = (): { account: string, password: string } | null => {
    const account = localStorage.getItem('remembered_account')
    const encryptedPassword = localStorage.getItem('remembered_password')

    if (!account || !encryptedPassword) {
        return null
    }

    return { 
        account, 
        password: decrypt(encryptedPassword)
    }
}

/**
 * 清除记住的凭证
 */
export const clearRememberedCredentials = () => {
    localStorage.removeItem('remembered_account')
    localStorage.removeItem('remembered_password')
}