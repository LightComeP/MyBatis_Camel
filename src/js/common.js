common = {
    //DESC : 라디오 값 세팅
    //param :
    //      comfName  [라디오 name 속성];
    //      val       [라디오 선택 순서];
    setRdoValue: function (comfName, val) {
      document.getElementsByName(comfName)[val].checked = true;
    },
    //DESC : 라디오 선택 값 가져오기
    //param :
    //      comfName  [라디오 name 속성];
  
  
  
    getRdoValue: function (comfName, options) {
      if (options == null || options == undefined) {
        options = 'index';
      }
      let radioArr = document.getElementsByName(comfName);
      for (let i = 0; i < radioArr.length; i++) {
        if (radioArr[i].checked) {
          if (options == 'index') {
            return i;
          } else {
            return radioArr[i].value;
          }
        }
      }
    },
    getSbxValue: function (comfName, options) {
      if (options == null || options == undefined) {
        options = 'index';
      }
      let sbxObj = document.getElementById(comfName);
      let selIndex = sbxObj.options.selectedIndex;
      let selValue = sbxObj.options[selIndex].value;
      if (options == 'index') {
        return selIndex;
      }
      return selValue;
    },
    getComf = function(comfid) {
        return document.getElementById(comfid);
    }
  };
  