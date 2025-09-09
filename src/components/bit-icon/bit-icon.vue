<script setup>
  import { computed } from 'vue'
  const props = defineProps({
    // 图标名称
    name: {
      type: String,
      required: true
    },
    // 图标尺寸
    size: [String, Number],
    // 图标宽度
    width: [String, Number],
    // 图标高度
    height: [String, Number],
    // 是否是圆形
    round: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits(['click'])

  const iconUrl = computed(() => {
    return props.name.startsWith('http')
      ? props.name
      : `/static/icons/${props.name}.png`
  })

  const iconStyle = computed(() => {
    return {
      width: (props.size || props.width) + 'rpx',
      height: (props.size || props.height) + 'rpx',
      borderRadius: props.round ? '50%' : 'none'
    }
  })
</script>

<template>
  <image
    mode="scaleToFill"
    :src="iconUrl"
    :style="iconStyle"
    @click="emit('click', $event)"
  />
</template>

<style lang="scss"></style>
