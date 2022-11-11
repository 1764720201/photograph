"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
function determineDirection(clipX, clipY, clipWidth, clipHeight, currentX, currentY) {
  let corner;
  const mainPoint = [clipX + clipWidth / 2, clipY + clipHeight / 2];
  const currentPoint = [currentX, currentY];
  if (currentPoint[0] <= mainPoint[0] && currentPoint[1] <= mainPoint[1]) {
    corner = 3;
  } else if (currentPoint[0] >= mainPoint[0] && currentPoint[1] <= mainPoint[1]) {
    corner = 2;
  } else if (currentPoint[0] <= mainPoint[0] && currentPoint[1] >= mainPoint[1]) {
    corner = 4;
  } else if (currentPoint[0] >= mainPoint[0] && currentPoint[1] >= mainPoint[1]) {
    corner = 1;
  }
  return corner;
}
function calcImageOffset(data, scale) {
  let left = data.imageLeft;
  let top = data.imageTop;
  scale = scale || data.scale;
  let imageWidth = data.imageWidth;
  let imageHeight = data.imageHeight;
  if (data.angle / 90 % 2) {
    imageWidth = data.imageHeight;
    imageHeight = data.imageWidth;
  }
  const {
    clipX,
    clipWidth,
    clipY,
    clipHeight
  } = data;
  const currentImageSize = (size) => size * scale / 2;
  const currentImageWidth = currentImageSize(imageWidth);
  const currentImageHeight = currentImageSize(imageHeight);
  left = clipX + currentImageWidth >= left ? left : clipX + currentImageWidth;
  left = clipX + clipWidth - currentImageWidth <= left ? left : clipX + clipWidth - currentImageWidth;
  top = clipY + currentImageHeight >= top ? top : clipY + currentImageHeight;
  top = clipY + clipHeight - currentImageHeight <= top ? top : clipY + clipHeight - currentImageHeight;
  return {
    left,
    top,
    scale
  };
}
function calcImageScale(data, scale) {
  scale = scale || data.scale;
  let {
    imageWidth,
    imageHeight,
    clipWidth,
    clipHeight,
    angle
  } = data;
  if (angle / 90 % 2) {
    imageWidth = imageHeight;
    imageHeight = imageWidth;
  }
  if (imageWidth * scale < clipWidth) {
    scale = clipWidth / imageWidth;
  }
  if (imageHeight * scale < clipHeight) {
    scale = Math.max(scale, clipHeight / imageHeight);
  }
  return scale;
}
function calcImageSize(width, height, data) {
  let imageWidth = width, imageHeight = height;
  let {
    clipWidth,
    clipHeight,
    sysinfo,
    width: originWidth,
    height: originHeight
  } = data;
  if (imageWidth && imageHeight) {
    if (imageWidth / imageHeight > (clipWidth || originWidth) / (clipWidth || originHeight)) {
      imageHeight = clipHeight || originHeight;
      imageWidth = width / height * imageHeight;
    } else {
      imageWidth = clipWidth || originWidth;
      imageHeight = height / width * imageWidth;
    }
  } else {
    let sys = sysinfo || common_vendor.index.getSystemInfoSync();
    imageWidth = sys.windowWidth;
    imageHeight = 0;
  }
  return {
    imageWidth,
    imageHeight
  };
}
function calcPythagoreanTheorem(width, height) {
  return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
}
function clipTouchMoveOfCalculate(data, event) {
  const clientX = event.touches[0].clientX;
  const clientY = event.touches[0].clientY;
  let {
    clipWidth,
    clipHeight,
    clipY: oldClipY,
    clipX: oldClipX,
    clipStart,
    isLockRatio,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight
  } = data;
  maxWidth = maxWidth / 2;
  minWidth = minWidth / 2;
  minHeight = minHeight / 2;
  maxHeight = maxHeight / 2;
  let width = clipWidth, height = clipHeight, clipY = oldClipY, clipX = oldClipX, sizecorrect = () => {
    width = width <= maxWidth ? width >= minWidth ? width : minWidth : maxWidth;
    height = height <= maxHeight ? height >= minHeight ? height : minHeight : maxHeight;
  }, sizeinspect = () => {
    sizecorrect();
    if ((width > maxWidth || width < minWidth || height > maxHeight || height < minHeight) && isLockRatio) {
      return false;
    } else {
      return true;
    }
  };
  height = clipStart.height + (clipStart.corner > 1 && clipStart.corner < 4 ? 1 : -1) * (clipStart.y - clientY);
  switch (clipStart.corner) {
    case 1:
      width = clipStart.width - clipStart.x + clientX;
      if (isLockRatio) {
        height = width / (clipWidth / clipHeight);
      }
      if (!sizeinspect())
        return;
      break;
    case 2:
      width = clipStart.width - clipStart.x + clientX;
      if (isLockRatio) {
        height = width / (clipWidth / clipHeight);
      }
      if (!sizeinspect()) {
        return;
      } else {
        clipY = clipStart.clipY - (height - clipStart.height);
      }
      break;
    case 3:
      width = clipStart.width + clipStart.x - clientX;
      if (isLockRatio) {
        height = width / (clipWidth / clipHeight);
      }
      if (!sizeinspect()) {
        return;
      } else {
        clipY = clipStart.clipY - (height - clipStart.height);
        clipX = clipStart.clipX - (width - clipStart.width);
      }
      break;
    case 4:
      width = clipStart.width + clipStart.x - clientX;
      if (isLockRatio) {
        height = width / (clipWidth / clipHeight);
      }
      if (!sizeinspect()) {
        return;
      } else {
        clipX = clipStart.clipX - (width - clipStart.width);
      }
      break;
  }
  return {
    width,
    height,
    clipX,
    clipY
  };
}
function imageTouchMoveOfCalcOffset(data, clientXForLeft, clientYForLeft) {
  let left = clientXForLeft - data.touchRelative[0].x, top = clientYForLeft - data.touchRelative[0].y;
  return {
    left,
    top
  };
}
exports.calcImageOffset = calcImageOffset;
exports.calcImageScale = calcImageScale;
exports.calcImageSize = calcImageSize;
exports.calcPythagoreanTheorem = calcPythagoreanTheorem;
exports.clipTouchMoveOfCalculate = clipTouchMoveOfCalculate;
exports.determineDirection = determineDirection;
exports.imageTouchMoveOfCalcOffset = imageTouchMoveOfCalcOffset;
