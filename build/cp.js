/**
 * @desc    创建客户端axios请求
 * @file    create-api-client.js
 * @author  
 */
import qs from 'qs'
import axios from 'axios'
import Vue from 'vue'

axios.interceptors.response.use((res) => {
    if (res.status >= 200 && res.status < 300) {
        return res
    }
    return Promise.reject(res)
}, (error) => {
    // 网络异常
    return Promise.reject(error)
})

axios.interceptors.request.use(config => {
    config.headers['x-client-token'] = '43f3ba6d015d4207861fcd9d558aaffc'
        // const token = Vue.ls.get('x-client-token')
        // if (token) {
        //     config.headers['x-client-token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
        // }
    return config
})

export function createAPI({ client }) {
    axios.defaults.timeout = client.timeout
    axios.defaults.baseURL = client.baseurl
    axios.defaults.withCredentials = true
    return {
        get(url, params = {}) {
            return new Promise((resolve, reject) => {
                axios({
                    url,
                    params,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    method: 'get'
                }).then(res => {
                    resolve(res.data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        post(url, params = {}) {
            return new Promise((resolve, reject) => {
                axios({
                    url,
                    data: qs.stringify(params),
                    method: 'post',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => {
                    resolve(res.data)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}
},
function(need, callback) {
    if (need) {
        mkdirs(path.dirname(toDir), callback);
    } else {
        callback(null, true);
    }
},
function(p, callback) {
    var reads = fs.createReadStream(file);
    var writes = fs.createWriteStream(path.join(path.dirname(toDir), path.basename(file)));
    reads.pipe(writes);
    //don't forget close the  when  all the data are read
    reads.on("end", function() {
        writes.end();
        callback(null);
    });
    reads.on("error", function(err) {
        console.log("error occur in reads");
        callback(true, err);
    });

}
], cb);

}

// cursively count the  files that need to be copied

function _ccoutTask(from, to, cbw) {
    async.waterfall([
        function(callback) {
            fs.stat(from, callback);
        },
        function(stats, callback) {
            if (stats.isFile()) {
                cbw.addFile(from, to);
                callback(null, []);
            } else if (stats.isDirectory()) {
                fs.readdir(from, callback);
            }
        },
        function(files, callback) {
            if (files.length) {
                for (var i = 0; i < files.length; i++) {
                    _ccoutTask(path.join(from, files[i]), path.join(to, files[i]), cbw.increase());
                }
            }
            callback(null);
        }
    ], cbw);

}
// wrap the callback before counting
function ccoutTask(from, to, cb) {
    var files = [];
    var count = 1;

    function wrapper(err) {
        count--;
        if (err || count <= 0) {
            cb(err, files)
        }
    }

    wrapper.increase = function() {
        count++;
        return wrapper;
    }
    wrapper.addFile = function(file, dir) {
        files.push({
            file: file,
            dir: dir
        });
    }

    _ccoutTask(from, to, wrapper);
}


function copyDir(from, to, cb) {
    if (!cb) {
        cb = function() {};
    }
    async.waterfall([
        function(callback) {
            fs.exists(from, function(exists) {
                if (exists) {
                    callback(null, true);
                } else {
                    console.log(from + " not exists");
                    callback(true);
                }
            });
        },
        function(exists, callback) {
            fs.stat(from, callback);
        },
        function(stats, callback) {
            if (stats.isFile()) {
                // one file copy
                copyFile(from, to, function(err) {
                    if (err) {
                        // break the waterfall
                        callback(true);
                    } else {
                        callback(null, []);
                    }
                });
            } else if (stats.isDirectory()) {
                ccoutTask(from, to, callback);
            }
        },
        function(files, callback) {
            // prevent reaching to max file open limit
            async.mapLimit(files, 10, function(f, cb) {
                copyFile(f.file, f.dir, cb);
            }, callback);
        }
    ], cb);
}

// 给dist添加依package.json文件
const file = resolve(`../dist/package.json`)
const packageJson = `{
  "name": "vue-ssr-template",
  "version": "1.0.0",
  "description": "A Vue.js project 2.0 for server side rendering.",
  "author": "",
  "license": "MIT",
  "scripts": {
    "start": "cross-env NODE_ENV=production node server",
    "pm2": "cross-env NODE_ENV=production pm2 start processes.json"
  },
  "dependencies": {
    "axios": "^0.13.1",
    "cookie-parser": "^1.4.3",
    "cross-env": "^3.1.4",
    "express": "^4.14.0",
    "lru-cache": "^4.0.1",
    "nprogress": "^0.2.0",
    "serialize-javascript": "^1.3.0",
    "serve-favicon": "^2.3.0",
    "uiv": "^0.14.3",
    "vue": "^2.3.4",
    "vue-router": "^2.7.0",
    "vue-server-renderer": "^2.3.4",
    "vuex": "^2.3.0",
    "vuex-router-sync": "^4.1.2",
    "http-proxy-middleware": "^0.17.3"
  }
}`

// 把打包后的文件放在dist目录文件夹
const dirArr = ['output/', 'public/', 'config/', 'processes.json', 'server.js']
dirArr.forEach(function(item) {
    let src = resolve(`../${item}`)
    let dst = resolve(`../dist/${item}`)
    copyDir(src, dst, (err) => {
        if (err) return console.error(err)
        if (item === dirArr[dirArr.length - 1]) {
            fs.writeFile(file, packageJson, (err) => {
                if (err) throw err
                console.log('build ok!')
            })
        }
    })
})