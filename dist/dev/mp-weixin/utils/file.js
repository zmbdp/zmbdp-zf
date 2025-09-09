"use strict";
const common_vendor = require("../common/vendor.js");
const utils_toast = require("./toast.js");
const utils_request = require("./request.js");
const constants_common = require("../constants/common.js");
const chooseFile = ({ count, mediaType, sourceType }) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.chooseMedia({
      count,
      mediaType,
      sourceType,
      // 成功回调
      success: (res) => {
        if (!res.tempFiles.length) {
          resolve(null);
          return;
        }
        const [{ tempFilePath, size }] = res.tempFiles;
        const isGT5M = size > 5 * 1024 * 1024;
        if (isGT5M) {
          utils_toast.showNoneIconToast("图片大小不能超过5M");
          resolve(null);
          return;
        }
        console.log("文件选择成功");
        resolve(tempFilePath);
      },
      // 失败回调
      fail: (error) => {
        console.log("文件选择失败");
        utils_toast.showNoneIconToast(error.errMsg);
        reject(new Error(error.errMsg));
      }
    });
  });
};
const getFileSignApi = () => {
  return utils_request.request({
    method: "GET",
    url: "/file/sign"
  });
};
function createUUID() {
  let dt = Date.now();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : r & 3 | 8).toString(16);
    }
  );
  return uuid;
}
const getFileType = (tempFilePath) => {
  const extName = tempFilePath.slice(
    tempFilePath.lastIndexOf(".") + 1
  );
  let fileType = null;
  if (constants_common.imageExtName.includes(extName)) {
    fileType = "image";
  } else if (constants_common.audioExtName.includes(extName)) {
    fileType = "audio";
  } else if (constants_common.videoExtName.includes(extName)) {
    fileType = "video";
  }
  return fileType;
};
const uploadFile2OSS = (tempFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signRes = await getFileSignApi();
      console.log("获取文件签名成功", signRes);
      const {
        host,
        // 云服务器的域名
        pathPrefix,
        // 桶名称(路径，用来存储文件容器)
        policy,
        // 策略
        signature,
        // 签名
        xosscredential,
        // 密钥
        xossdate
        // 时间
      } = signRes;
      const extName = tempFilePath.slice(
        tempFilePath.lastIndexOf(".")
      );
      const formData = {
        success_action_status: 200,
        policy,
        "x-oss-signature-version": "OSS4-HMAC-SHA256",
        "x-oss-credential": xosscredential,
        "x-oss-date": xossdate,
        "x-oss-signature": signature,
        // 桶名+文件名.扩展名
        key: pathPrefix + createUUID() + extName,
        "x-oss-object-acl": "public-read"
      };
      common_vendor.index.uploadFile({
        url: host,
        filePath: tempFilePath,
        name: "file",
        fileType: getFileType(tempFilePath),
        formData,
        // 成功
        success: (res) => {
          if (res.statusCode === formData.success_action_status) {
            let fullUrl;
            if (host.startsWith("http://") || host.startsWith("https://")) {
              fullUrl = host + formData.key;
            } else {
              fullUrl = OSS_BASE_URL + host + formData.key;
            }
            resolve(fullUrl);
          } else {
            utils_toast.showNoneIconToast(res.errMsg);
            reject(new Error(res.errMsg));
          }
        },
        // 失败
        fail: (error) => {
          utils_toast.showNoneIconToast(error.errMsg);
          reject(new Error(error.errMsg));
        },
        // 上传完成：无论成功还是失败都会执行
        complete: () => {
          common_vendor.index.hideLoading({
            fail: () => {
            }
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
exports.chooseFile = chooseFile;
exports.uploadFile2OSS = uploadFile2OSS;
