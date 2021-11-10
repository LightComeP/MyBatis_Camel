common = {
  //DESC : 라디오 값 세팅
  //param : 
  //      comfName  [라디오 name 속성];
  //      val       [라디오 선택 순서];
   setRdoValue : function(comfName,val){ 
    document.getElementsByName(comfName)[val].checked = true;    
  }
  //DESC : 라디오 선택 값 가져오기
  //param : 
  //      comfName  [라디오 name 속성];
  ,getRdoValue : function(comfName, options){
    if(options == null || options == undefined){
       options = 'index'
    }
    let radioArr = document.getElementsByName(comfName);
    for(let i = 0 ; i<radioArr.length; i++){
      if(radioArr[i].checked){
        if(options == 'index'){
          return i;
        }else{
          return radioArr[i].value;
        }
      }
    }
  }
  ,getSbxValue : function(comfName, options){
    if(options == null || options == undefined){
       options = 'index'
    }
    let sbxObj    = document.getElementById(comfName);
    let selIndex  = sbxObj.options.selectedIndex;
    let selValue  = sbxObj.options[selIndex].value;
    if(options == 'index'){
      return selIndex;
    }
    return selValue;
  }
  
}

//radio 기본값 세팅
common.setRdoValue('rdo_compireType',0); // snakeType -> camleType
common.setRdoValue('rdo_parsingType',0); // camelType -> snackType





fGetComf = function(comfid) {
  return document.getElementById(comfid);
} 
fGetComf('ta_col').value = 'WORK_REQ_LIST WORK_SET_DATE WORK_REQ_DTTM'
  ////////////////////////////////////////////
  //선언
  ////////////////////////////////////////////

//////////////////// 데이터 파싱 시작
fTextCamelCaseparsing = async function() { // 데이터 파싱
  /////////////선언부
  let tableName     = fGetComf('ibx_tableName').value;
	var colText 		  = fGetComf('ta_col').value;           //컬럼 값
	var colCmText 		= fGetComf('ta_colCommand').value;  //컬럼 코멘드 값
  var gubunText 		= fGetComf('ibx_gubun').value;      //구분자 값
	var objresultDiv 	= fGetComf('resultDiv');            //결과 textArea Ele
	var maxLength		  = 0;

  const RESULT_DIV_INIT_SIZE = objresultDiv.parentNode.offsetHeight+'px'; // 결과 div와 textArea의 동적 높이 관리 위한 상수
  
  var colArr 		= colText.split(gubunText);             //컬럼 배열
	var colCmArr	= colCmText.split(gubunText);           //컬럼 코멘트 배열
	
  var resultColArr 		= [];                             //컬럼 결과 배열
  var resultColCmArr		= [];                           //컬럼 코멘트 결과 배열

	
  let spaceLength = 0;                                  //최소 공백 SIZE
//////////////////////////////////////////////
//colArr 생성, 공백 값 계산;
  let fcolArrMakeRetunObj = await fcolArrMake(colArr);
  resultColArr = fcolArrMakeRetunObj.resultColArr;
  spaceLength = fcolArrMakeRetunObj.spaceLength;
	
//////////////////////////////////////////////
//colCmArr 생성
	for(var i = 0; i < colCmArr.length; i++){		//colCmArr 생성
		resultColCmArr[i] = colCmArr[i].replaceAll(" ", "");
	}
//////////////////////////////////////////////
//노출 데이터 생성
  var resultText = "";                                    //결과값 문자열
  
    
	resultText += await fMakeParsingData(colArr, colCmArr, resultColArr, resultColCmArr, spaceLength, tableName);
  
  
	objresultDiv.value = resultText;
  let resultDiv = document.getElementById('resultDiv');
  let resultDivHeight = resultDiv.scrollHeight;
    
	if(resultDiv.offsetHeight < resultDivHeight){ 
    resultDiv.style.height = resultDivHeight+'px';
  }else{
    resultDiv.style.height = RESULT_DIV_INIT_SIZE;
  }
	
}



//DESC : 컬럼 배열, 길이에 따른 공백 값 만들기
//param 
//      colArr    : 파싱해야하는 colArr
//return : 
//      
fcolArrMake = async function(colArr){
  let resultColArr = []   // 
  let spaceLength = 0;    // 공백 값 확인
  let colflag = true;     // flag 선언
  let maxLength = 0;      // 공백 최대 길이
  let rdoSelVal =  common.getRdoValue('rdo_compireType','value');
  for (var col of colArr) {		// 
    col.replaceAll(" ", ""); // 공백 제거
    if (col == "") {
      continue; // 공백이라면 포함 X
    } 
    
    let fromCompireType = common.getSbxValue('sbx_fromCompireType', 'value');
    let toCompireType   = common.getSbxValue('sbx_toCompireType', 'value');
    let fromCompireTypeObj = {};
    
    for(let i = 0 ; i < colArr.length ; i++){
      let col = colArr[i];
      fromCompireTypeObj = fFromCompireType(col, fromCompireType); // 컴파일 탑으로 소문자 형태 return , Caseindex또한 리턴
    }
    
    
    
    
    
    
    
    
    if(rdoSelVal == 'S_->Ca'){ // Snake - > Camel
      col = col.toLowerCase();      //  소문자로 변환
      colflag = true;               //  언더바 체크 flag
      while (colflag) {
        var ui = col.indexOf("_");  //  UpperIndex
        if (ui < 0) {               //  언더바가 없다면 종료
          colflag = false;          
          continue;
        }
        col = col.slice(0, ui) + col.slice(ui + 1, ui + 2).toUpperCase() + col.slice(ui + 2); // 컴파일 TEST_DUMI - > testDumi;
      }
    }else if(rdoSelVal == 'Ca->S_'){ // Camel - > Snake
      let colDumi = col;
      col = '';
      for(char of colDumi){//한글자씩
        if(char.charCodeAt() > 64 && char.charCodeAt() < 91){
           col += '_'
        }
        col += char.toUpperCase();
      }
    }

    
    resultColArr.push(col); // 컴파일 데이터 배열 push
    ///////////////////// 글자 길이로 최대 공백값 구하기///////////////////// 
    if(col.length > maxLength){
      maxLength = col.length;
      spaceLength = (parseInt(maxLength/4)+1);
    }
    
  }
  return {resultColArr : resultColArr, spaceLength : spaceLength};// 파싱된 데이터, 공백 길이
}


  //DESC : 노출 데이터 생성 팝업
  //param   
  //      
  //return  :
  fMakeParsingData = async function(colArr, colCmArr, resultColArr, resultColCmArr,spaceLength, tableName){ 
    let resultText = '';                // 리턴 값 
    let spaceString = '';
    let parsingType = common.getRdoValue('rdo_parsingType','value'); //파싱 종류
    
    
    
    
    if(parsingType == 'basic'){//Basic
      /////////////// col + space + colCmt + \n; 작업 시작
      for(var i = 0; i < resultColArr.length; i++ ){ // col, colcoment 리턴값 작성
        spaceString = '';   // 공백 초기화
        let resultObj = await fGetSpaceLengthAndCmNullCheck(resultColArr[i], resultColCmArr[i], spaceLength);
        spaceString       = resultObj.spaceString;
        resultColCmArr[i] = resultObj.resultColCmArrValue;
        ///////////////////// SettingEnd ParsingStart
        
        resultText += (resultColArr[i] + spaceString + resultColCmArr[i] + '\n'); // col + space + colCmt + \n;
      }
      /////////////////col + space + colCmt + \n; 작업 끝  
    }else if(parsingType == 'select'){ // select
      let selectParsingText = '';
      let fromParsingText   = 'FROM\n\t\t' + 'TABLE_NAME';
      let sSelect1  = 'SELECT\n';
      let sSelect2  = '';
      let sFrom     = 'FROM\t';
      let sWhere1   = 'WHERE\t1 = 1\n';
      let sWhere2   = '';
      
      for(var i = 0; i < resultColArr.length; i++ ){ // col, colcoment 리턴값 작성
        spaceString = '';   // 공백 초기화
        let resultObj = await fGetSpaceLengthAndCmNullCheck(resultColArr[i], resultColCmArr[i], spaceLength);
        spaceString       = resultObj.spaceString;
        resultColCmArr[i] = resultObj.resultColCmArrValue;
        ///////////////////// SettingEnd ParsingStart
        
        sSelect2  += ( (i == 0 ? '\t\t ' : '\t\t,')
                     + colArr[i] 
                     + spaceString 
                     + 'AS ' 
                     + resultColArr[i] 
                     + spaceString 
                     + '/*' + resultColCmArr[i] + '*/' 
                     + '\n'
                     ); // col + space + colCmt + \n;
        sWhere2   += ( 'AND'
                     + '\t\t'
                     + colArr[i]
                     + spaceString
                     + '= '
                     + '#{'
                     + resultColArr[i]
                     + '}'
                     + spaceString
                     + '/*' + resultColCmArr[i] + '*/' 
                     + '\n'
                     );
      
      }
      
      resultText =  sSelect1 
                  + sSelect2 
                  + sFrom 
                  + tableName + '\n' 
                  + sWhere1
                  + sWhere2;
    }else if(parsingType == 'insert'){ // insert
      let sInsertInto = 'INSERT INTO ' + tableName + '\n(\n'
      let sInto       = '';
      let sValue      = '';
      
      for(var i = 0; i < resultColArr.length; i++ ){ // col, colcoment 리턴값 작성
        spaceString = '';   // 공백 초기화
        let resultObj = await fGetSpaceLengthAndCmNullCheck(resultColArr[i], resultColCmArr[i], spaceLength); // 공백, 널체크
        spaceString       = resultObj.spaceString;
        resultColCmArr[i] = resultObj.resultColCmArrValue;
        ///////////////////// SettingEnd ParsingStart
        sInto += (i == 0 ? '  ' :  ' ,')
               + colArr[i] 
               + spaceString 
               + '/*' 
               + resultColCmArr[i] 
               + '*/\n';
        
        sValue += (i == 0 ? '  ' : ' ,')
                + '#{' + resultColArr[i] + '}'
                + spaceString
               + '/*' 
               + resultColCmArr[i] 
               + '*/\n';
      }
      resultText = sInsertInto + sInto + ')\nVALUES\n(\n' + sValue;
    }else if(parsingType == 'update'){ 
      let sUpdate = 'UPDATE ' + tableName + '\n' + 'SET\n'; 
      let sSet    = '';
      let sWhere  = 'WHERE 1 = 1\n';
      
      for(var i = 0; i < resultColArr.length; i++ ){ // col, colcoment 리턴값 작성
        spaceString = '';   // 공백 초기화
        let resultObj = await fGetSpaceLengthAndCmNullCheck(resultColArr[i], resultColCmArr[i], spaceLength); // 공백, 널체크
        spaceString       = resultObj.spaceString;
        resultColCmArr[i] = resultObj.resultColCmArrValue;
        ///////////////////// SettingEnd ParsingStart
        
        sSet += (i == 0 ? '  ' : ' ,')
              + colArr[i] 
              + spaceString
              + '= #{' + resultColArr[i] + '}'
              + spaceString 
              + '/*' + resultColCmArr[i] + '*/\n';
        
        sWhere += (i == 0 ? '  ' : ' ,')
                + resultColArr[i]
                + spaceString
                + '= #{' + resultColArr[i] + '}'
                + spaceString 
                + '/*' + resultColCmArr[i] + '*/\n';
                
      }
      resultText = sUpdate + sSet + sWhere;
    }else if(parsingType = 'delete'){  
      let sdelete = 'DELETE FROM ' + tableName + '\n';
      let swhere   =  'WHERE 1 = 1\n'
      for(var i = 0; i < resultColArr.length; i++ ){ // col, colcoment 리턴값 작성
        spaceString   = '';   // 공백 초기화
        let resultObj = await fGetSpaceLengthAndCmNullCheck(resultColArr[i], resultColCmArr[i], spaceLength); // 공백, 널체크
        spaceString       = resultObj.spaceString;
        resultColCmArr[i] = resultObj.resultColCmArrValue;
        ///////////////////// SettingEnd ParsingStart
        
        swhere += colArr[i]
                + spaceString
                + '= #{' + resultColArr[i] + '}'
                + spaceString
                + '/*' + resultColCmArr[i] + '*/\n';
        
        
      }
      resultText = sdelete + swhere;
    }
    
    
    
    
    return resultText;
  }  







////////////////////////////// 컬럼의 최대 길이를 통한 공백 구하기 및 코멘트 공백으로 만들기
fGetSpaceLengthAndCmNullCheck = async function(resultColArrValue, resultColCmArrValue, spaceLength){
  let spaceString = '';
    
  for(var j = 0; j <= spaceLength - parseInt(resultColArrValue.length / 4); j++){ // 최대 공백 길이에서 col의 길이만큼 빼주기
    spaceString += '\t';
  }
  if(resultColCmArrValue == null || resultColCmArrValue == 'undefined'){ // 값이 없다면 공백으로
    resultColCmArrValue = '';
  }
  return {spaceString : spaceString, resultColCmArrValue, resultColCmArrValue};
};


fFromCompireType = async function(col, fromCompireType){
  let charArr = [];
  if(fromCompireType == 'snakeCase'){
        
  }
  
}