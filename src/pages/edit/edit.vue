<script setup>
  import { ref } from 'vue';
  import { chooseFile, uploadFile2OSS } from '@/utils/file';
  import { useUserStore } from '@/stores';
  import { putUserInfoApi } from '@/api/user';
  const userStore = useUserStore();

  // 临时头像
  const tempAvatar = ref(userStore.userInfo.avatar);
  // 临时昵称
  const tempNickName = ref(userStore.userInfo.nickName);

  // 选择头像
  const onSelectAvatar = async () => {
    const tempFilePath = await chooseFile({
      count: 1,
      mediaType: ['image'],
      souceType: ['album', 'camera']
    });
    if (!tempFilePath) return;
    // tempFilePath: 从相册中选择的或拍照的临时图片路径

    // 把临时文件路径上传至OSS云服务器
    // 并把得到的真实的网络图片路径赋值给 tempAvatar
    try {
      tempAvatar.value = await uploadFile2OSS(tempFilePath);
    } catch (e) {}
  };

  // 提交修改
  const onSubmit = async () => {
    // 收集修改的用户信息
    const params = {};
    // 拿到用户修改后的头像地址和用户昵称
    if (tempAvatar.value !== userStore.userInfo.avatar) {
      params.avatar = tempAvatar.value;
    }
    if (
      tempNickName.value &&
      tempNickName.value !== userStore.userInfo.nickName
    ) {
      params.nickName = tempNickName.value;
    }
    console.log('修改后的用户信息', params);
    // 当 params 对象的健的数组有值，说明用户改了信息
    // 只有在修改了用户信息之后，才会发请求（此时的请求才有意义）
    if (Object.keys(params).length > 0) {
      try {
        // 调用接口(把修改后的信息同步到数据库)
        await putUserInfoApi({
          ...params,
          userId: userStore.userInfo.userId
        });
        // 把修改后的用户信息同步到 pinia 中
        userStore.setUserInfoAction(params);
      } catch (e) {}
    }

    // 返回到我的页
    setTimeout(() => {
      uni.navigateBack();
    }, 500);
  };
</script>

<template>
  <view class="edit">
    <!-- 导航栏 -->
    <bit-nav-bar title="编辑资料" />
    <!-- 主体 -->
    <scroll-view scroll-y class="body">
      <view class="main">
        <view class="cell touxiang">
          <view class="left">编辑头像</view>
          <view class="right" @click="onSelectAvatar">
            <image
              :src="tempAvatar"
              mode="scaleToFill"
              class="avatar"
            />
            <bit-icon name="fanhui-right" size="26" />
          </view>
        </view>
        <view class="cell nicheng">
          <view class="left">编辑昵称</view>
          <view class="right">
            <input class="input" v-model.trim="tempNickName" />
            <bit-icon name="fanhui-right" size="26" />
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 底部提交按钮 -->
    <view class="footer">
      <button class="btn-submit" @click="onSubmit">提交</button>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .edit {
    // 主体
    .body {
      position: fixed;
      top: 176rpx;
      @include bottom-safe__distance(108);
      box-sizing: border-box;
      width: 750rpx;
      padding: 21rpx 30rpx 0;
      background: $bg-color-shallow;
      .main {
        padding: 0 20rpx 0 57rpx;
        background: $bg-color-white;
        border-radius: 16rpx;
        .cell {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30rpx 0;
          &.touxiang {
            @include border-1rpx;
          }
          .left {
            font-size: $font-size-md-28;
            color: $font-color-dark;
            font-weight: 600;
          }
          .right {
            display: flex;
            align-items: center;
            .avatar {
              width: 48rpx;
              height: 48rpx;
              margin-right: 20rpx;
              border-radius: 50%;
            }
            .input {
              width: 170rpx;
              margin-right: 20rpx;
              font-size: $font-size-md-28;
              text-align: right;
              color: $font-color-shallow;
            }
          }
        }
      }
    }
    // 底部
    .footer {
      position: fixed;
      left: 0;
      @include bottom-safe__distance;
      padding: 14rpx 30rpx;
      background: $bg-color-white;
      .btn-submit {
        width: 690rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: $font-size-md-28;
        font-weight: 500;
        border-radius: 16rpx;
        background: linear-gradient(
          to right,
          $bg-color-from,
          $bg-color-to
        );
        color: $font-color-white;
      }
    }
  }
</style>
