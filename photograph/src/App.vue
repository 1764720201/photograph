<script setup lang="ts">
import uniIdPageInit from '@/uni_modules/uni-id-pages/init';

onLaunch(async () => {
  console.log('App Launch');
  await uniIdPageInit();
});
onShow(async () => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import './static/icon.css';
@import './uni_modules/vk-uview-ui/index.scss';
page {
  background-color: #e0e2e5;
}
</style>
