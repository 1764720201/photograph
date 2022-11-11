<template></template>

<script lang="ts" setup>
uni.getLocation({
  isHighAccuracy: true,
  type: 'gcj02',
  success: e => {
    uni.openLocation(e);
  }
});
</script>

<style lang="scss" scoped></style>
