let idleSpritesheet; // 儲存停滯動畫的精靈圖。
let walkSpritesheet; // 儲存行走動畫的精靈圖。
let idleFrames = []; // 儲存停滯動畫的個別畫格。
let walkFrames = []; // 儲存行走動畫的個別畫格。
let currentFrames = []; // 儲存目前要播放的動畫畫格。
let currentAnimType = 'idle'; // 記錄目前動畫狀態為停滯或行走。
let frameIndex = 0; // 記錄目前播放的畫格索引。
let frameRateTimer = 0; // 累計畫格時間以控制動畫速度。
let animationSpeed = 6; // 設定每隔幾個繪圖影格切換一次精靈畫格。
let charX; // 儲存角色在畫布上的水平位置。
let charY; // 儲存角色在畫布上的垂直位置。
let charSpeed = 3; // 設定角色每次繪圖移動的像素數。
let facingDirection = 1; // 設定角色朝向，1 為右方、-1 為左方。

function preload() { // 在建立畫布前載入動畫圖片。
  idleSpritesheet = loadImage('1/停/停.png'); // 載入停滯精靈圖。
  walkSpritesheet = loadImage('1/走/走.png'); // 載入 8 格的行走精靈圖。
} // 結束圖片載入函式。

function setup() { // 設定畫布並切割動畫精靈圖。
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布。
  charX = width / 2; // 將角色初始水平位置設在畫布中央。
  charY = height / 2; // 將角色初始垂直位置設在畫布中央。
  const idleFrameCount = 13; // 設定停滯動畫實際包含的 13 個完整畫格。
  for (let i = 0; i < idleFrameCount; i++) { // 逐一切割停滯精靈圖的畫格。
    const frameStart = Math.floor(i * idleSpritesheet.width / idleFrameCount); // 計算目前畫格的整數起點。
    const frameEnd = Math.floor((i + 1) * idleSpritesheet.width / idleFrameCount); // 計算下一格的整數起點作為終點。
    idleFrames.push(idleSpritesheet.get(frameStart, 0, frameEnd - frameStart, idleSpritesheet.height)); // 裁切並儲存目前停滯畫格。
  } // 結束停滯精靈圖切割。
  const walkFrameCount = 8; // 設定行走動畫的總畫格數。
  for (let i = 0; i < walkFrameCount; i++) { // 逐一切割行走精靈圖的畫格。
    const frameStart = Math.floor(i * walkSpritesheet.width / walkFrameCount); // 計算目前畫格的整數起點。
    const frameEnd = Math.floor((i + 1) * walkSpritesheet.width / walkFrameCount); // 計算下一格的整數起點作為終點。
    walkFrames.push(walkSpritesheet.get(frameStart, 0, frameEnd - frameStart, walkSpritesheet.height)); // 裁切並儲存目前行走畫格。
  } // 結束行走精靈圖切割。
  currentFrames = idleFrames; // 預設播放停滯動畫。
} // 結束畫布與動畫初始化。

function draw() { // 每個繪圖影格更新背景、角色位置與動畫。
  background('#fdf0d5'); // 使用指定的背景色 #fdf0d5 清除上一影格。
  handleKeyboardInput(); // 讀取方向鍵並更新角色狀態。
  frameRateTimer++; // 累計動畫播放計時器。
  if (frameRateTimer >= animationSpeed) { // 到達動畫切換時間時更新畫格。
    frameIndex = (frameIndex + 1) % currentFrames.length; // 循環切換目前動畫畫格。
    frameRateTimer = 0; // 重設動畫播放計時器。
  } // 結束動畫畫格更新判斷。
  const currentImg = currentFrames[frameIndex]; // 取得目前要繪製的角色圖片。
  const displayHeight = 150; // 設定角色顯示高度為 150 像素。
  const displayWidth = (currentImg.width / currentImg.height) * displayHeight; // 依照原始比例計算角色顯示寬度。
  const horizontalLimit = Math.min(displayWidth / 2, width / 2); // 計算角色不超出畫布的水平邊界。
  charX = constrain(charX, horizontalLimit, width - horizontalLimit); // 將角色位置限制在畫布左右範圍內。
  push(); // 暫存畫布座標與縮放設定。
  translate(charX, charY); // 將繪圖原點移至角色位置。
  scale(facingDirection, 1); // 依照角色朝向水平翻轉畫面。
  imageMode(CENTER); // 將角色圖片的繪製基準設為中心點。
  image(currentImg, 0, 0, displayWidth, displayHeight); // 以計算好的尺寸繪製角色畫格。
  pop(); // 還原畫布座標與縮放設定。
} // 結束每影格繪圖函式。

function handleKeyboardInput() { // 根據左右方向鍵控制角色移動與動畫狀態。
  let isMoving = false; // 預設本次更新中角色沒有移動。
  if (keyIsDown(RIGHT_ARROW)) { // 判斷使用者是否按住鍵盤右方向鍵。
    charX += charSpeed; // 將角色向右移動。
    facingDirection = 1; // 設定角色面向右方。
    if (currentAnimType !== 'walk') { // 只有狀態改變時才切換至行走動畫。
      currentAnimType = 'walk'; // 記錄目前播放行走動畫。
      currentFrames = walkFrames; // 指定行走動畫畫格。
      frameIndex = 0; // 從行走動畫第一格開始播放。
    } // 結束行走動畫切換判斷。
    isMoving = true; // 記錄角色正在移動。
  } else if (keyIsDown(LEFT_ARROW)) { // 判斷使用者是否按住鍵盤左方向鍵。
    charX -= charSpeed; // 將角色向左移動。
    facingDirection = -1; // 設定角色面向左方並水平翻轉。
    if (currentAnimType !== 'walk') { // 只有狀態改變時才切換至行走動畫。
      currentAnimType = 'walk'; // 記錄目前播放行走動畫。
      currentFrames = walkFrames; // 指定行走動畫畫格。
      frameIndex = 0; // 從行走動畫第一格開始播放。
    } // 結束行走動畫切換判斷。
    isMoving = true; // 記錄角色正在移動。
  } // 結束左右方向鍵判斷。
  if (!isMoving && currentAnimType !== 'idle') { // 沒有移動且目前不是停滯動畫時切回待機。
    currentAnimType = 'idle'; // 記錄目前播放停滯動畫。
    currentFrames = idleFrames; // 指定停滯動畫畫格。
    frameIndex = 0; // 從停滯動畫第一格開始播放。
  } // 結束待機動畫切換判斷。
} // 結束鍵盤輸入處理函式。

function windowResized() { // 瀏覽器視窗尺寸改變時重新調整畫布。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗。
} // 結束視窗尺寸調整函式。