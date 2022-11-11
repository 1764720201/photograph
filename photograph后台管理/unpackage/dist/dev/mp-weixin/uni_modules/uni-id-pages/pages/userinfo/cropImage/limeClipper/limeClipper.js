"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils = require("./utils.js");
const cache = {};
const _sfc_main = {
  name: "l-clipper",
  props: {
    value: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "2d"
    },
    customStyle: {
      type: String
    },
    canvasId: {
      type: String,
      default: "l-clipper"
    },
    zIndex: {
      type: Number,
      default: 99
    },
    imageUrl: {
      type: String
    },
    fileType: {
      type: String,
      default: "png"
    },
    quality: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    minWidth: {
      type: Number,
      default: 200
    },
    maxWidth: {
      type: Number,
      default: 600
    },
    minHeight: {
      type: Number,
      default: 200
    },
    maxHeight: {
      type: Number,
      default: 600
    },
    isLockWidth: {
      type: Boolean,
      default: false
    },
    isLockHeight: {
      type: Boolean,
      default: false
    },
    isLockRatio: {
      type: Boolean,
      default: true
    },
    scaleRatio: {
      type: Number,
      default: 1
    },
    minRatio: {
      type: Number,
      default: 0.5
    },
    maxRatio: {
      type: Number,
      default: 2
    },
    isDisableScale: {
      type: Boolean,
      default: false
    },
    isDisableRotate: {
      type: Boolean,
      default: false
    },
    isLimitMove: {
      type: Boolean,
      default: false
    },
    isShowPhotoBtn: {
      type: Boolean,
      default: true
    },
    isShowRotateBtn: {
      type: Boolean,
      default: true
    },
    isShowConfirmBtn: {
      type: Boolean,
      default: true
    },
    isShowCancelBtn: {
      type: Boolean,
      default: true
    },
    rotateAngle: {
      type: Number,
      default: 90
    },
    source: {
      type: Object,
      default: () => ({
        album: "\u4ECE\u76F8\u518C\u4E2D\u9009\u62E9",
        camera: "\u62CD\u7167",
        message: "\u4ECE\u5FAE\u4FE1\u4E2D\u9009\u62E9"
      })
    }
  },
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      clipX: 0,
      clipY: 0,
      clipWidth: 0,
      clipHeight: 0,
      animation: false,
      imageWidth: 0,
      imageHeight: 0,
      imageTop: 0,
      imageLeft: 0,
      scale: 1,
      angle: 0,
      image: this.imageUrl,
      sysinfo: {},
      throttleTimer: null,
      throttleFlag: true,
      timeClipCenter: null,
      flagClipTouch: false,
      flagEndTouch: false,
      clipStart: {},
      animationTimer: null,
      touchRelative: [{ x: 0, y: 0 }],
      hypotenuseLength: 0,
      ctx: null
    };
  },
  computed: {
    clipStyle() {
      const { clipWidth, clipHeight, clipY, clipX, animation } = this;
      return `
			width: ${clipWidth}px;
			height:${clipHeight}px;
			transition-property: ${animation ? "" : "background"};
			left: ${clipX}px;
			top: ${clipY}px
			`;
    },
    imageStyle() {
      const { imageWidth, imageHeight, imageLeft, imageTop, animation, scale, angle } = this;
      return `
				width: ${imageWidth ? imageWidth + "px" : "auto"};
				height: ${imageHeight ? imageHeight + "px" : "auto"};
				transform: translate3d(${imageLeft - imageWidth / 2}px, ${imageTop - imageHeight / 2}px, 0) scale(${scale}) rotate(${angle}deg);
				transition-duration: ${animation ? 0.35 : 0}s
			`;
    },
    clipSize() {
      const { clipWidth, clipHeight } = this;
      return { clipWidth, clipHeight };
    },
    clipPoint() {
      const { clipY, clipX } = this;
      return { clipY, clipX };
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.animation = 0;
        this.angle = 0;
      } else {
        if (this.imageUrl) {
          const { imageWidth, imageHeight, imageLeft, imageTop, scale, clipX, clipY, clipWidth, clipHeight, path } = (cache == null ? void 0 : cache[this.imageUrl]) || {};
          if (path != this.image) {
            this.image = this.imageUrl;
          } else {
            this.setDiffData({ imageWidth, imageHeight, imageLeft, imageTop, scale, clipX, clipY, clipWidth, clipHeight });
          }
        }
      }
    },
    imageUrl(url) {
      this.image = url;
    },
    image: {
      handler: async function(url) {
        this.getImageInfo(url);
      }
    },
    clipSize({ widthVal, heightVal }) {
      let { minWidth, minHeight } = this;
      minWidth = minWidth / 2;
      minHeight = minHeight / 2;
      if (widthVal < minWidth) {
        this.setDiffData({ clipWidth: minWidth });
      }
      if (heightVal < minHeight) {
        this.setDiffData({ clipHeight: minHeight });
      }
      this.calcClipSize();
    },
    angle(val) {
      this.animation = true;
      this.moveStop();
      const { isLimitMove } = this;
      if (isLimitMove && val % 90) {
        this.setDiffData({
          angle: Math.round(val / 90) * 90
        });
      }
      this.imgMarginDetectionScale();
    },
    animation(val) {
      clearTimeout(this.animationTimer);
      if (val) {
        let animationTimer = setTimeout(() => {
          this.setDiffData({
            animation: false
          });
        }, 260);
        this.setDiffData({ animationTimer });
        this.animationTimer = animationTimer;
      }
    },
    isLimitMove(val) {
      if (val) {
        if (this.angle % 90) {
          this.setDiffData({
            angle: Math.round(this.angle / 90) * 90
          });
        }
        this.imgMarginDetectionScale();
      }
    },
    clipPoint() {
      this.cutDetectionPosition();
    },
    width(width, oWidth) {
      if (width !== oWidth) {
        this.setDiffData({
          clipWidth: width / 2
        });
      }
    },
    height(height, oHeight) {
      if (height !== oHeight) {
        this.setDiffData({
          clipHeight: height / 2
        });
      }
    }
  },
  mounted() {
    const sysinfo = common_vendor.index.getSystemInfoSync();
    this.sysinfo = sysinfo;
    this.setClipInfo();
    if (this.image) {
      this.getImageInfo(this.image);
    }
    this.setClipCenter();
    this.calcClipSize();
    this.cutDetectionPosition();
  },
  methods: {
    setDiffData(data) {
      Object.keys(data).forEach((key) => {
        if (this[key] !== data[key]) {
          this[key] = data[key];
        }
      });
    },
    getImageInfo(url) {
      if (!url)
        return;
      if (this.value) {
        common_vendor.index.showLoading({
          title: "\u8BF7\u7A0D\u5019...",
          mask: true
        });
      }
      common_vendor.index.getImageInfo({
        src: url,
        success: (res) => {
          this.imgComputeSize(res.width, res.height);
          this.image = res.path;
          if (this.isLimitMove) {
            this.imgMarginDetectionScale();
            this.$emit("ready", res);
          }
          const { imageWidth, imageHeight, imageLeft, imageTop, scale, clipX, clipY, clipWidth, clipHeight } = this;
          cache[url] = Object.assign(res, { imageWidth, imageHeight, imageLeft, imageTop, scale, clipX, clipY, clipWidth, clipHeight });
        },
        fail: (err) => {
          this.imgComputeSize();
          if (this.isLimitMove) {
            this.imgMarginDetectionScale();
          }
        }
      });
    },
    setClipInfo() {
      const { width, height, sysinfo, canvasId } = this;
      const clipWidth = width / 2;
      const clipHeight = height / 2;
      const clipY = (sysinfo.windowHeight - clipHeight) / 2;
      const clipX = (sysinfo.windowWidth - clipWidth) / 2;
      const imageLeft = sysinfo.windowWidth / 2;
      const imageTop = sysinfo.windowHeight / 2;
      this.ctx = common_vendor.index.createCanvasContext(canvasId, this);
      this.clipWidth = clipWidth;
      this.clipHeight = clipHeight;
      this.clipX = clipX;
      this.clipY = clipY;
      this.canvasHeight = clipHeight;
      this.canvasWidth = clipWidth;
      this.imageLeft = imageLeft;
      this.imageTop = imageTop;
    },
    setClipCenter() {
      const { sysInfo, clipHeight, clipWidth, imageTop, imageLeft } = this;
      let sys = sysInfo || common_vendor.index.getSystemInfoSync();
      let clipY = (sys.windowHeight - clipHeight) * 0.5;
      let clipX = (sys.windowWidth - clipWidth) * 0.5;
      this.imageTop = imageTop - this.clipY + clipY;
      this.imageLeft = imageLeft - this.clipX + clipX;
      this.clipY = clipY;
      this.clipX = clipX;
    },
    calcClipSize() {
      const { clipHeight, clipWidth, sysinfo, clipX, clipY } = this;
      if (clipWidth > sysinfo.windowWidth) {
        this.setDiffData({
          clipWidth: sysinfo.windowWidth
        });
      } else if (clipWidth + clipX > sysinfo.windowWidth) {
        this.setDiffData({
          clipX: sysinfo.windowWidth - clipX
        });
      }
      if (clipHeight > sysinfo.windowHeight) {
        this.setDiffData({
          clipHeight: sysinfo.windowHeight
        });
      } else if (clipHeight + clipY > sysinfo.windowHeight) {
        this.clipY = sysinfo.windowHeight - clipY;
        this.setDiffData({
          clipY: sysinfo.windowHeight - clipY
        });
      }
    },
    cutDetectionPosition() {
      const { clipX, clipY, sysinfo, clipHeight, clipWidth } = this;
      let cutDetectionPositionTop = () => {
        if (clipY < 0) {
          this.setDiffData({ clipY: 0 });
        }
        if (clipY > sysinfo.windowHeight - clipHeight) {
          this.setDiffData({ clipY: sysinfo.windowHeight - clipHeight });
        }
      }, cutDetectionPositionLeft = () => {
        if (clipX < 0) {
          this.setDiffData({ clipX: 0 });
        }
        if (clipX > sysinfo.windowWidth - clipWidth) {
          this.setDiffData({ clipX: sysinfo.windowWidth - clipWidth });
        }
      };
      if (clipY === null && clipX === null) {
        let newClipY = (sysinfo.windowHeight - clipHeight) * 0.5;
        let newClipX = (sysinfo.windowWidth - clipWidth) * 0.5;
        this.setDiffData({
          clipX: newClipX,
          clipY: newClipY
        });
      } else if (clipY !== null && clipX !== null) {
        cutDetectionPositionTop();
        cutDetectionPositionLeft();
      } else if (clipY !== null && clipX === null) {
        cutDetectionPositionTop();
        this.setDiffData({
          clipX: (sysinfo.windowWidth - clipWidth) / 2
        });
      } else if (clipY === null && clipX !== null) {
        cutDetectionPositionLeft();
        this.setDiffData({
          clipY: (sysinfo.windowHeight - clipHeight) / 2
        });
      }
    },
    imgComputeSize(width, height) {
      const { imageWidth, imageHeight } = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.calcImageSize(width, height, this);
      this.imageWidth = imageWidth;
      this.imageHeight = imageHeight;
    },
    imgMarginDetectionScale(scale) {
      if (!this.isLimitMove)
        return;
      const currentScale = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.calcImageScale(this, scale);
      this.imgMarginDetectionPosition(currentScale);
    },
    imgMarginDetectionPosition(scale) {
      if (!this.isLimitMove)
        return;
      const { scale: currentScale, left, top } = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.calcImageOffset(this, scale);
      this.setDiffData({
        imageLeft: left,
        imageTop: top,
        scale: currentScale
      });
    },
    throttle() {
      this.setDiffData({
        throttleFlag: true
      });
    },
    moveDuring() {
      clearTimeout(this.timeClipCenter);
    },
    moveStop() {
      clearTimeout(this.timeClipCenter);
      const timeClipCenter = setTimeout(() => {
        if (!this.animation) {
          this.setDiffData({ animation: true });
        }
        this.setClipCenter();
      }, 800);
      this.setDiffData({ timeClipCenter });
    },
    clipTouchStart(event) {
      if (!this.image) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u56FE\u7247",
          icon: "none"
        });
        return;
      }
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const { clipX, clipY, clipWidth, clipHeight } = this;
      const corner = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.determineDirection(clipX, clipY, clipWidth, clipHeight, currentX, currentY);
      this.moveDuring();
      if (!corner) {
        return;
      }
      this.clipStart = {
        width: clipWidth,
        height: clipHeight,
        x: currentX,
        y: currentY,
        clipY,
        clipX,
        corner
      };
      this.flagClipTouch = true;
      this.flagEndTouch = true;
    },
    clipTouchMove(event) {
      if (!this.image) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u56FE\u7247",
          icon: "none"
        });
        return;
      }
      if (event.touches.length !== 1) {
        return;
      }
      const { flagClipTouch, throttleFlag } = this;
      if (flagClipTouch && throttleFlag) {
        const { isLockRatio, isLockHeight, isLockWidth } = this;
        if (isLockRatio && (isLockWidth || isLockHeight))
          return;
        this.setDiffData({
          throttleFlag: false
        });
        this.throttle();
        const clipData = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.clipTouchMoveOfCalculate(this, event);
        if (clipData) {
          const { width, height, clipX, clipY } = clipData;
          if (!isLockWidth && !isLockHeight) {
            this.setDiffData({
              clipWidth: width,
              clipHeight: height,
              clipX,
              clipY
            });
          } else if (!isLockWidth) {
            this.setDiffData({
              clipWidth: width,
              clipX
            });
          } else if (!isLockHeight) {
            this.setDiffData({
              clipHeight: height,
              clipY
            });
          }
          this.imgMarginDetectionScale();
        }
      }
    },
    clipTouchEnd() {
      this.moveStop();
      this.flagClipTouch = false;
    },
    imageTouchStart(e) {
      this.flagEndTouch = false;
      const { imageLeft, imageTop } = this;
      const clientXForLeft = e.touches[0].clientX;
      const clientYForLeft = e.touches[0].clientY;
      let touchRelative = [];
      if (e.touches.length === 1) {
        touchRelative[0] = {
          x: clientXForLeft - imageLeft,
          y: clientYForLeft - imageTop
        };
        this.touchRelative = touchRelative;
      } else {
        const clientXForRight = e.touches[1].clientX;
        const clientYForRight = e.touches[1].clientY;
        let width = Math.abs(clientXForLeft - clientXForRight);
        let height = Math.abs(clientYForLeft - clientYForRight);
        const hypotenuseLength = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.calcPythagoreanTheorem(width, height);
        touchRelative = [
          {
            x: clientXForLeft - imageLeft,
            y: clientYForLeft - imageTop
          },
          {
            x: clientXForRight - imageLeft,
            y: clientYForRight - imageTop
          }
        ];
        this.touchRelative = touchRelative;
        this.hypotenuseLength = hypotenuseLength;
      }
    },
    imageTouchMove(e) {
      const { flagEndTouch, throttleFlag } = this;
      if (flagEndTouch || !throttleFlag)
        return;
      const clientXForLeft = e.touches[0].clientX;
      const clientYForLeft = e.touches[0].clientY;
      this.setDiffData({ throttleFlag: false });
      this.throttle();
      this.moveDuring();
      if (e.touches.length === 1) {
        const { left: imageLeft, top: imageTop } = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.imageTouchMoveOfCalcOffset(this, clientXForLeft, clientYForLeft);
        this.setDiffData({
          imageLeft,
          imageTop
        });
        this.imgMarginDetectionPosition();
      } else {
        const clientXForRight = e.touches[1].clientX;
        const clientYForRight = e.touches[1].clientY;
        let width = Math.abs(clientXForLeft - clientXForRight), height = Math.abs(clientYForLeft - clientYForRight), hypotenuse = uni_modules_uniIdPages_pages_userinfo_cropImage_limeClipper_utils.calcPythagoreanTheorem(width, height), scale = this.scale * (hypotenuse / this.hypotenuseLength);
        if (this.isDisableScale) {
          scale = 1;
        } else {
          scale = scale <= this.minRatio ? this.minRatio : scale;
          scale = scale >= this.maxRatio ? this.maxRatio : scale;
          this.$emit("change", {
            width: this.imageWidth * scale,
            height: this.imageHeight * scale
          });
        }
        this.imgMarginDetectionScale(scale);
        this.hypotenuseLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.scale = scale;
      }
    },
    imageTouchEnd() {
      this.setDiffData({
        flagEndTouch: true
      });
      this.moveStop();
    },
    uploadImage() {
      const itemList = Object.entries(this.source);
      const sizeType = ["original", "compressed"];
      const success = ({ tempFilePaths: a, tempFiles: b }) => {
        this.image = a ? a[0] : b[0].path;
      };
      const _uploadImage = (type) => {
        if (type !== "message") {
          common_vendor.index.chooseImage({
            count: 1,
            sizeType,
            sourceType: [type],
            success
          });
        }
        if (type == "message") {
          wx.chooseMessageFile({
            count: 1,
            type: "image",
            success
          });
        }
      };
      if (itemList.length > 1) {
        common_vendor.index.showActionSheet({
          itemList: itemList.map((v) => v[1]),
          success: ({ tapIndex: i }) => {
            _uploadImage(itemList[i][0]);
          }
        });
      } else {
        _uploadImage(itemList[0][0]);
      }
    },
    imageReset() {
      const sys = this.sysinfo || common_vendor.index.getSystemInfoSync();
      this.scale = 1;
      this.angle = 0;
      this.imageTop = sys.windowHeight / 2;
      this.imageLeft = sys.windowWidth / 2;
    },
    imageLoad(e) {
      this.imageReset();
      common_vendor.index.hideLoading();
      this.$emit("ready", e.detail);
    },
    rotate(event) {
      if (this.isDisableRotate)
        return;
      if (!this.image) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u56FE\u7247",
          icon: "none"
        });
        return;
      }
      const { rotateAngle } = this;
      const originAngle = this.angle;
      const type = event.currentTarget.dataset.type;
      if (type === "along") {
        this.angle = originAngle + rotateAngle;
      } else {
        this.angle = originAngle - rotateAngle;
      }
      this.$emit("rotate", this.angle);
    },
    confirm() {
      if (!this.image) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u56FE\u7247",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D"
      });
      const { canvasHeight, canvasWidth, clipHeight, clipWidth, ctx, scale, imageLeft, imageTop, clipX, clipY, angle, scaleRatio: dpr, image, quality, fileType, type: imageType, canvasId } = this;
      const draw = () => {
        const imageWidth = this.imageWidth * scale * dpr;
        const imageHeight = this.imageHeight * scale * dpr;
        const xpos = imageLeft - clipX;
        const ypos = imageTop - clipY;
        ctx.translate(xpos * dpr, ypos * dpr);
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
        ctx.draw(false, () => {
          const width = clipWidth * dpr;
          const height = clipHeight * dpr;
          let params = {
            x: 0,
            y: 0,
            width,
            height,
            destWidth: width,
            destHeight: height,
            canvasId,
            fileType,
            quality,
            success: (res) => {
              data.url = res.tempFilePath;
              common_vendor.index.hideLoading();
              this.$emit("success", data);
              this.$emit("input", false);
            },
            fail: (error) => {
              console.error("error", error);
              this.$emit("fail", error);
              this.$emit("input", false);
            }
          };
          let data = {
            url: "",
            width,
            height
          };
          common_vendor.index.canvasToTempFilePath(params, this);
        });
      };
      if (canvasWidth !== clipWidth || canvasHeight !== clipHeight) {
        this.canvasWidth = clipWidth;
        this.canvasHeight = clipHeight;
        ctx.draw();
        this.$nextTick(() => {
          setTimeout(() => {
            draw();
          }, 100);
        });
      } else {
        draw();
      }
    },
    cancel() {
      this.$emit("cancel", false);
      this.$emit("input", false);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f([0, 0, 0, 0], (item, index, i0) => {
      return {
        a: index
      };
    }),
    b: common_vendor.s($options.clipStyle),
    c: common_vendor.o((...args) => $options.clipTouchStart && $options.clipTouchStart(...args)),
    d: common_vendor.o((...args) => $options.clipTouchMove && $options.clipTouchMove(...args)),
    e: common_vendor.o((...args) => $options.clipTouchEnd && $options.clipTouchEnd(...args)),
    f: $data.image
  }, $data.image ? {
    g: common_vendor.o((...args) => $options.imageLoad && $options.imageLoad(...args)),
    h: common_vendor.o((...args) => $options.imageLoad && $options.imageLoad(...args)),
    i: common_vendor.o((...args) => $options.imageTouchStart && $options.imageTouchStart(...args)),
    j: common_vendor.o((...args) => $options.imageTouchMove && $options.imageTouchMove(...args)),
    k: common_vendor.o((...args) => $options.imageTouchEnd && $options.imageTouchEnd(...args)),
    l: $data.image,
    m: $data.imageWidth == "auto" ? "widthFix" : "",
    n: common_vendor.s($options.imageStyle)
  } : {}, {
    o: $props.canvasId,
    p: common_vendor.s("width: " + $data.canvasWidth * $props.scaleRatio + "px; height:" + $data.canvasHeight * $props.scaleRatio + "px;"),
    q: $props.isShowCancelBtn
  }, $props.isShowCancelBtn ? common_vendor.e({
    r: _ctx.$slots.cancel
  }, _ctx.$slots.cancel ? {} : {}, {
    s: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  }) : {}, {
    t: $props.isShowPhotoBtn
  }, $props.isShowPhotoBtn ? common_vendor.e({
    v: _ctx.$slots.photo
  }, _ctx.$slots.photo ? {} : {}, {
    w: common_vendor.o((...args) => $options.uploadImage && $options.uploadImage(...args))
  }) : {}, {
    x: $props.isShowRotateBtn
  }, $props.isShowRotateBtn ? common_vendor.e({
    y: _ctx.$slots.rotate
  }, _ctx.$slots.rotate ? {} : {}, {
    z: common_vendor.o((...args) => $options.rotate && $options.rotate(...args))
  }) : {}, {
    A: $props.isShowConfirmBtn
  }, $props.isShowConfirmBtn ? common_vendor.e({
    B: _ctx.$slots.confirm
  }, _ctx.$slots.confirm ? {} : {}, {
    C: common_vendor.o((...args) => $options.confirm && $options.confirm(...args))
  }) : {}, {
    D: $props.value ? 1 : "",
    E: common_vendor.s("z-index: " + $props.zIndex + ";" + $props.customStyle)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5dd2a2ff"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/uni_modules/uni-id-pages/pages/userinfo/cropImage/limeClipper/limeClipper.vue"]]);
wx.createComponent(Component);
