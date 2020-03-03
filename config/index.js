const isProd = process.env.NODE_ENV === 'production'

const proUrl = 'https://h.dalieyingcai.com' // 生产环境api地址
const devUrl = 'https://hh.dalie.zpstar.com' // 开发api地址

const FaceUrl = isProd ? proUrl : devUrl

module.exports = {
    baseUrl: FaceUrl,
    client: {
        baseurl: '/api',
        timeout: 10000
    },
    server: {
        baseurl: FaceUrl + '/api',
        timeout: 10000
    }
}