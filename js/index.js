$(function() {
  // localStorage.clear();
  let PMColorArr = [
    '9CFF9C',
    '31FF00',
    '31CF00',
    'FFFF00',
    'FFCF00',
    'FF9A00',
    'FF6464',
    'FF0000',
    '990000',
    'CE30FF'
  ];
  let textColor = ['000', 'fff'];

  let compute = pm25 => {
    let s = {};
    if (pm25 >= 0 && pm25 <= 11) {
      s.text = '低';
      s.bgcolor = PMColorArr[0];
      s.textColor = textColor[0];
      s.p = 1;
    } else if (pm25 >= 12 && pm25 <= 23) {
      s.text = '低';
      s.bgcolor = PMColorArr[1];
      s.textColor = textColor[0];
      s.p = 1;
    } else if (pm25 >= 24 && pm25 <= 35) {
      s.text = '低';
      s.bgcolor = PMColorArr[2];
      s.textColor = textColor[1];
      s.p = 1;
    } else if (pm25 >= 36 && pm25 <= 41) {
      s.text = '中';
      s.bgcolor = PMColorArr[3];
      s.textColor = textColor[0];
      s.p = 2;
    } else if (pm25 >= 42 && pm25 <= 47) {
      s.text = '中';
      s.bgcolor = PMColorArr[4];
      s.textColor = textColor[0];
      s.p = 2;
    } else if (pm25 >= 48 && pm25 <= 53) {
      s.text = '中';
      s.bgcolor = PMColorArr[5];
      s.textColor = textColor[0];
      s.p = 2;
    } else if (pm25 >= 54 && pm25 <= 58) {
      s.text = '高';
      s.bgcolor = PMColorArr[6];
      s.textColor = textColor[0];
      s.p = 3;
    } else if (pm25 >= 59 && pm25 <= 64) {
      s.text = '高';
      s.bgcolor = PMColorArr[7];
      s.textColor = textColor[1];
      s.p = 3;
    } else if (pm25 >= 65 && pm25 <= 70) {
      s.text = '高';
      s.bgcolor = PMColorArr[8];
      s.textColor = textColor[1];
      s.p = 3;
    } else {
      s.text = '極高';
      s.bgcolor = PMColorArr[9];
      s.textColor = textColor[1];
      s.p = 4;
    }
    return s;
  };

  // add color to footer table backgroundColor
  let cLen = $('.table td').length;
  for (let c = 0; c < cLen; c++) {
    $('.table td:nth-child(' + (c + 1) + ')').css(
      'backgroundColor',
      '#' + PMColorArr[c]
    );
  }

  // -------------------click event----------------------

  // nav toggle
  let dis = 250; // open side menu distance
  let moveMenu = () => {
    $('#nav-toggle').toggleClass('active');

    $('body').animate({ 'margin-left': '+=' + dis + 'px' }, 700);
    dis *= -1;
  };
  $('nav').on('click', () => {
    moveMenu();
  });

  // click citys it will show site ( side menu )
  $('.citys > li').on('click', function() {
    $(this)
      .next('.site')
      .slideToggle(500);
  });

  // click menu do this to put data to the main
  let setPM_data = area => {
    let local_city_num = localStorage.getItem('local_city_num');

    if (window.localStorage) {
      if (local_city_num) {
        let pm25 = area[local_city_num].PM25; // pm Data
        if (pm25 != '') {
          let sort = compute(pm25); // set pm color & text

          // set 縣市
          $('main h2').text(
            area[local_city_num].county + '  ' + area[local_city_num].Site
          );
          // set 等級分類
          $('#sort_text').text(sort.text);
          // set 背景、文字顏色
          $('main').css({
            color: '#' + sort.textColor,
            background: '#' + sort.bgcolor
          });
          // set 建議
          $('#content').load('suggest.html p:nth-child(' + sort.p + ')');
        } else {
          $('main h2').text('')
          $('#content').text('資料更新中')
          $('#sort_text').text('...');
        }
      }
    }
  };

  // -------------------menu ajax----------------------

  let getData = data => {
    setPM_data(data); // show data

    let countryArr = []; // to count country length
    for (let datas of data) {
      countryArr.push(datas.county);
    }

    // 讓每個縣市動態載入鄉鎮
    $('li').each(function(index) {
      $(this).after('<ul class="site hide"></ul>');

      for (let c = 0, cl = countryArr.length; c < cl; c++) {
        if ($(this).text() === data[c].county) {
          $(this)
            .next('ul')
            .append('<li>' + data[c].Site + '</li>');
        }
      }
    });

    // user cheese he want to know city's data
    $('.site li').on('click', function() {
      moveMenu();
      for (let i = 0; i < countryArr.length; i++) {
        if ($(this).text() === data[i].Site) {
          // svae lastest array num to localstorage
          localStorage.setItem('local_city_num', i);
          setPM_data(data);
        }
      }
    });
  };

  $.ajax({
    type: 'GET',
    url: 'https://opendata.epa.gov.tw/ws/Data/ATM00625/?$format=json',
    dataType: 'jsonp',
    async: false,
    success: getData,
    error: function() {
      alert('錯誤，無法取得資料!');
    }
  });
});
