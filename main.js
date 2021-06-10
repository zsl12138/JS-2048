$(function () {
  // 是否产生了新元素
  var isNewItem = false;
  // 当前游戏分数
  var game_score = 0;
  // 游戏最高分
  var best_score = 0;
  // 查询本地存储最高分
  if (localStorage.best_score) {
    best_score = localStorage.best_score - 0;
  } else {
    best_score = 0;
  }


  // 主函数执行部分
  gameInit();
  $('.new-game').click(function (e) {
    // 取消点击链接的默认行为
    e.preventDefault();
    refreshGame();
    isNoticed = false;
  });




  // 游戏初始化函数
  function gameInit() {
    // 初始化分数
    $('.score').html(game_score);
    $('.best').html(best_score);
    // 生成两个小方块
    newItem();
    newItem();
    refreshColor();
  }



  // 重新开始游戏函数
  function refreshGame() {
    // 1.重新开始游戏就要重置分数
    game_score = 0;
    $('.score').html(game_score);
    // 2.获取所有方块 ,清空所有方块的颜色
    var items = $('.tile-container .grid-cell');
    for (let i = 0; i < items.length; i++) {
      items.eq(i).html('').removeClass('occupied').addClass('empty')
      console.log(i);
    }
    // 3.点击了new game 如果此时警示框是显示状态，要关闭显示框
    // 而且如果此时警示框中还有keep going 要记得移除keep going
    $('.game-message').css("display", "none");
    if ($('.keep-playing-button')) {
      $('.keep-playing-button').remove();
    }
    // 3.随机生成两个新的方块
    newItem();
    newItem();
    refreshColor();
  }



  // 产生随机数函数 Math.random返回0-1的一个数
  function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }


  // 随机生成砖块函数
  function newItem() {
    var newRndArr = [2, 2, 2, 2, 2, 2, 4];
    // getRandom(0, 6)返回0-6之间的一个随机数
    var newRndNum = newRndArr[getRandom(0, 6)];
    console.log('newRndNum: ' + newRndNum);
    // 随机生成方块:1.获取所有的空白方块集合 2.从空白方块集合中随机抽取一个索引号生成方块
    var emptyItems = $('.empty');
    var newRndSite = getRandom(0, emptyItems.length - 1);
    // 生成方块的方法是：将html()填充对应的数字，移除empty类，添加occupied类
    emptyItems.eq(newRndSite).html(newRndNum).removeClass('empty').addClass('occupied').addClass("tileAppear").css('animation-name','appear');
    setTimeout(function(){
      emptyItems.eq(newRndSite).css('animation-name','');
    },200);
    
  }



  // 选取currentItem旁边的一个元素，如direction为left，就返回currentItem左边的这个元素
  function getSideItem(currentItem, direction) {
    // 得到当前元素在矩阵中的位置
    var currentItemX = currentItem.attr('x') - 0;
    var currentItemY = currentItem.attr('y') - 0;
    switch (direction) {
      case 'left':
        var sideItemX = currentItemX;
        var sideItemY = currentItemY - 1;
        break;
      case 'right':
        var sideItemX = currentItemX;
        var sideItemY = currentItemY + 1;
        break;
      case 'up':
        var sideItemX = currentItemX - 1;
        var sideItemY = currentItemY;
        break;
      case 'down':
        var sideItemX = currentItemX + 1;
        var sideItemY = currentItemY;
        break;
    }
    var sideItem = $('.tile-container .x' + sideItemX + 'y' + sideItemY);
    console.log(sideItem);
    return sideItem;
  }

  //     // 回调函数，当移动动画执行完毕后，让盒子瞬间返回初始位置
  //     function callback(item, sideItem,direction) {
  // sideItem.html(item.html()).removeClass('empty').addClass('occupied');
  // item.html('').removeClass('occupied').addClass('empty');
  //       switch (direction) {
  //         case 'left':
  //           item.animate({
  //             currentItem.css("transform","translateX()")
  //           }, 0)
  //           break;
  //         case 'right':
  //           item.animate({
  //             right: '+=121.25'
  //           }, 0)
  //           break;
  //         case 'up':
  //           item.animate({
  //             top: '+=121.25'
  //           }, 0)
  //           break;
  //         case 'down':
  //           item.animate({
  //             bottom: '+=121.25'
  //           }, 0)
  //           break;
  //       }
  //     }
  // function moveAnimate(item, sideItem,direction) {
  //   switch (direction) {
  //     case 'left':
  //       item.animate({
  //         left: '-=121.25'
  //       }, 'slow', callback(item,sideItem, direction))
  //       break;
  //     case 'right':
  //       item.animate({
  //         right: '-=121.25'
  //       }, 'slow', callback(item, sideItem,direction))
  //       break;
  //     case 'up':
  //       item.animate({
  //         top: '-=121.25'
  //       }, 'slow', callback(item,sideItem, direction))
  //       break;
  //     case 'down':
  //       item.animate({
  //         bottom: '-=121.25'
  //       }, 'slow', callback(item, sideItem,direction))
  //       break;
  //   }
  // }
// sleep阻塞线程
  function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}

  //  单个元素移动函数:
  // 1.先获取该函数direction方向上的sideItem
  // 2.判断sideItem的各种情况
  function moveItem(currentItem, direction) {

    var sideItem = getSideItem(currentItem, direction);
    // 1.如果当前元素没有sideItem，即在最边上，不用动。
    if (sideItem.length == 0) {}


    // 2.如果当前元素不在最边上，且旁边的元素是空的,就左（上，下，左，右）移
    // 移动的时候要注意add和remove的使用，成功移动了就要设置isNewItem为true，指定需要添加方块
    else if (sideItem.html() == '') {
      // 动画：这里涉及到了一个异步函数的问题，因为动画需要执行500ms，而在执行期间，后续的脚本语句全部被执行了
        // currentItem.addClass('tileMove').css("animation-name", "move_" + direction);
        sideItem.html(currentItem.html()).removeClass('empty').addClass('occupied');
        currentItem.html('').removeClass('occupied').addClass('empty');
        // 只要移动了，就要再判断，这里用到了递归
        moveItem(sideItem, direction);
        isNewItem = true;
      // setTimeout(function () {
      //   sideItem.html(currentItem.html()).removeClass('empty').addClass('occupied');
      //   currentItem.html('').removeClass('occupied').removeClass('tileMove').addClass('empty').css('animation-name','');
      //   refreshColor();
      //   moveItem(sideItem, direction);
      // }, 100)    
    }


    // 3.如果当前元素不在最边上，且旁边元素非空但不相等，也不用动
    else if (sideItem.html() !== currentItem.html()) {}
    // 如果当前元素不在最边上，且旁边元素非空也相等，就合并
    else {
      // currentItem.addClass('tileMove').css("animation-name", "move_" + direction);
      sideItem.html((sideItem.html() - 0) * 2).addClass('tileAppear').css('animation-name','appear');
      // 当动画结束后就去除盒子的动画名字，否则下次该盒子动画无效
      setTimeout(function(){
        sideItem.css('animation-name','');
      },200);
      currentItem.html('').removeClass('occupied').addClass('empty');
      // setTimeout(function () {
      //   sideItem.html((sideItem.html() - 0) * 2);
      //   currentItem.html('').removeClass('occupied').removeClass('tileMove').addClass('empty').css('animation-name','');
      //   refreshColor();
      // }, 100)
    // 游戏分数增加 字符串转为数字可以用parseInt，Number()，还有str-0这种弱类型转换
    game_score += (sideItem.text() - 0);
    $('.score').html(game_score);
    $('.addition').html('+'+sideItem.text()).css('display','block').css('animation-name','addition');
    setTimeout(function(){
      $('.addition').css('display','none').css('animation-name','');
    },390)
    
    //  游戏分数更新了，当然要判断best score是否需要更新
    best_score = best_score > game_score ? best_score : game_score;
    $('.best').html(best_score);
    // 同时还需要更新本地存储的最高分
    localStorage.best_score = best_score;
    isNewItem = true;
    return;
  }
}



  // 移动砖块函数：顺序是move->getSideItem->moveItem
  function move(direction) {
    var occupiedItems = $('.occupied');
    // 1.如果按下的是left或up，则正向遍历，即从左（上）边第一个元素开始一个一个执行moveItem
    if (direction == 'left' || direction == 'up') {
      for (let i = 0; i < occupiedItems.length; i++) {
        var currentItem = occupiedItems.eq(i);
        moveItem(currentItem, direction);

      }
      // 2.如果是down和right，就要反向遍历
    } else if (direction == 'down' || direction == 'right') {
      // 注意这里有个bug，一定要设置i>=0 否则第一个砖块动不了的
      for (let i = occupiedItems.length - 1; i >= 0; i--) {
        var currentItem = occupiedItems.eq(i);
        moveItem(currentItem, direction);
      }
    }
    // 每次按下键盘之后，如果合并了元素（不管合并了几次），那么就必须产生一个元素
    if (isNewItem) {
      newItem();
      refreshColor();
      isNewItem = false;
    }
  }


  // 刷新颜色，每次块的数值发生变化时触发
  // 1.先获取所有方块
  // 2，遍历所有方块的内容，根据数字给他们的背景颜色做相应的更换
  function refreshColor() {
    var items = $('.tile-container .grid-cell');
    for (let i = 0; i < items.length; i++) {
      switch (items.eq(i).html()) {
        case '':
          items.eq(i).css('background', 'transparent');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '2':
          items.eq(i).css('background', 'rgb(238, 228, 218)');
          items.eq(i).css('color', '#776e65');
          break;
        case '4':
          items.eq(i).css('background', 'rgb(237,224,200)');
          items.eq(i).css('color', '#776e65');
          break;
        case '8':
          items.eq(i).css('background', 'rgb(242, 177, 121)');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '16':
          items.eq(i).css('background', '#f59563');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '32':
          items.eq(i).css('background', '#f67c5f');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '64':
          items.eq(i).css('background', '#f65e3b');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '128':
          items.eq(i).css('background', '#edcf72');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '256':
          items.eq(i).css('background', '#edcc61');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '512':
          items.eq(i).css('background', 'rgb(124, 183, 231)');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '1024':
          items.eq(i).css('background', 'rgb(225, 219, 215)');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '2048':
          items.eq(i).css('background', 'rgb(221, 160, 221)');
          items.eq(i).css('color', '#f9f6f2');
          break;
        case '4096':
          items.eq(i).css('background', 'rgb(250, 139, 176)');
          items.eq(i).css('color', '#f9f6f2');
          break;
      }
    }
  }


  // 为电脑方向键绑定事件监听，每次按下键盘触发move函数并判断游戏是否结束
  $('body').keydown(function (e) {
    // 如果警示框是弹出状态，禁用键盘事件
    if ($('.game-message').css("display") != 'block') {
      switch (e.keyCode) {
        case 37:
          console.log('left');
          move('left');
          isGameOver();
          break;
        case 38:
          // up
          console.log('up');
          move('up');
          isGameOver();
          break;
        case 39:
          // right
          console.log('right');
          move('right');
          isGameOver();
          break;
        case 40:
          // down
          console.log('down');
          move('down');
          isGameOver();
          break;
      }
    }
  })
  // 判断游戏是否结束
  // 1.首先判断当前的occupied元素数量是否等于方块总数量
  // 2.遍历每一个方格，如果该方格的上下左右四个方向的方块都非空且不相等，则game over；

  var isNoticed = false;

  function isGameOver() {
    // 设置flag，只要有一个方块的周围可以移动，就结束函数
    var flag = false;
    var items = $('.tile-container .grid-cell');
    var occupiedItems = $('.occupied');
    // 如果没有提醒过游戏胜利，就先判断是够有2048出现，如果有直接设置flag=true并加上Keep going标签
    if (isNoticed == false) {
      for (let i = 0; i < occupiedItems.length; i++) {
        if (occupiedItems.eq(i).html() == "64") {
          flag = true;
          // 设置已经提醒过了，否则后续会继续弹
          isNoticed = true;
          // 先让a标签keep going补充到框中幷修改文字内容在弹出
          $('.game-message p').text('You win');
          $('.lower').prepend('<a href="#" class="keep-playing-button">Keep going</a>');
          // 给keep going按钮绑定点击事件
          $('.keep-playing-button').click(function (e) {
            // 点击了keep-going隐藏警示框并且移除keep going按钮
            $('.game-message').css("display", "none");
            $('.keep-playing-button').remove();
            $('.game-message p').text('Game over');
          })
          break;
        }
      }
    }
    // 如果每个格子都有方块，就判断是不是没法再继续动了
    if (items.length == occupiedItems.length) {
      for (let i = 0; i < occupiedItems.length; i++) {
        var currentItem = occupiedItems.eq(i);
        if (getSideItem(currentItem, 'left') && getSideItem(currentItem, 'left').html() == currentItem.html()) {
          return;
        } else if (getSideItem(currentItem, 'down') && getSideItem(currentItem, 'down').html() == currentItem.html()) {
          return;
        } else if (getSideItem(currentItem, 'right') && getSideItem(currentItem, 'right').html() == currentItem.html()) {
          return;
        } else if (getSideItem(currentItem, 'up') && getSideItem(currentItem, 'up').html() == currentItem.html()) {
          return;
          // 如果不满足，即周围没有可以合并的方块，则设置flag=true 弹出警示框
        } else {
          flag = true;
        }
      }
    }
    //  如果flag为true，则弹出提醒框
    if (flag == true) {
      //  设置css属性最好用css(); attr只能设置标签属性
      // console.log('game over');
      // 1.设置弹出框动画，由于display不能直接用动画，所以处理办法是先设置其为block，然后opacity过渡从0-100；
      // $('.game-message').css("display", "block");
      // $('.game-message').css("animation-name", "fadeOut");
      // 2.直接使用Jquery的过度动画
      $('.game-message').fadeToggle(1000);
      $('.retry').click(function (e) {
        e.preventDefault();
        $('.new-game').click();
        // 点击retry等于触发new-game，同时要记得点击了以后要让弹出框消失
        $('.game-message').css("display", "none");
      })
    }
  }
})