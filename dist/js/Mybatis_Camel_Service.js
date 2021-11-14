//DESC : 컬럼 배열, 길이에 따른 공백 값 만들기
//param 
//      colArr    : 파싱해야하는 colArr
//return : 
//      
fcolArrMake = async function (colArr) {
  let resultColArr = []; // 
  let spaceLength = 0; // 공백 값 확인
  let colflag = true; // flag 선언
  let maxLength = 0; // 공백 최대 길이
  let rdoSelVal = common.getRdoValue('rdo_compireType', 'value');
  for (var col of colArr) { // 
    col.replaceAll(" ", ""); // 공백 제거
    if (col == "") {
      continue; // 공백이라면 포함 X
    }

    let fromCompireType = common.getSbxValue('sbx_fromCompireType', 'value');
    let toCompireType = common.getSbxValue('sbx_toCompireType', 'value');
    let fromCompireTypeObj = {};

    fromCompireTypeObj = await fFromCompireType(col, fromCompireType); // 컴파일 타입을 소문자 파싱 return , Caseindex또한 리턴
    col = await fToCompireType(fromCompireTypeObj, toCompireType); // 컴파일 형태에 맞춰 문자열 return;

    resultColArr.push(col); // 컴파일 데이터 배열 push

    ///////////////////// 글자 길이로 최대 공백값 구하기///////////////////// 
    if (col.length > maxLength) {
      maxLength = col.length;
      spaceLength = (parseInt(maxLength / 4) + 1);
    }

  }
  return { resultColArr: resultColArr, spaceLength: spaceLength }; // 파싱된 데이터, 공백 길이
};


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
      resultText = sInsertInto + sInto + ')\nVALUES\n(\n' + sValue + ')';
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
  let charArr       = [];
  let gubunCaseNum  = []
  let j = 0;
  

  
  for(let i  = 0 ; i < col.length ; i++){
    if(fromCompireType == 'snakeCase'){ //snakeCase SNAKE_CASE_TEST -> snakecase,[5,9];
      if(col[i] == "_"){
        j++
        gubunCaseNum.push(i-j+1);
        continue;
      }
      charArr[i-j] = col[i].toLowerCase();
    }else if(fromCompireType == 'camelCase' || fromCompireType == 'pascalCase'){ //camelCase camelCaseTest -> camelcasetest,[5,9];
      if(col[i].charCodeAt() > 64 && col[i].charCodeAt() < 91){
        if(!(fromCompireType == 'pascalCase' && i == 0)){
          gubunCaseNum.push(i);
        }
      }
      charArr[i] = col[i].toLowerCase();
    }else if(fromCompireType == 'kebabCase'){
      if(col[i] == "-"){
        j++
        gubunCaseNum.push(i-j+1);
        continue;
      }
      charArr[i-j] = col[i].toLowerCase();
    }
  }

  return {gubunCaseNum : gubunCaseNum, charArr : charArr};
}



////////////////////////////////////////
fToCompireType = async function(fromCompireTypeObj, toCompireType){
  let charArr        = fromCompireTypeObj.charArr;
  let colGubunIndex = fromCompireTypeObj.gubunCaseNum;
  let colText       = '';
  let j             = 0;

  

  
  for(let i = 0 ; i < charArr.length; i++){
    
    if(toCompireType == 'snakeCase' || toCompireType == 'kebabCase' ){
      charArr[i] = charArr[i].toUpperCase();
    }else if(toCompireType == 'pascalCase' && i == 0){
      charArr[i] = charArr[i].toUpperCase();
    }
    
    if(i == colGubunIndex[j]){
        j++;
      if(toCompireType == 'camelCase' || toCompireType == 'pascalCase'){         //camelCase : camelcasetest,[5,9] -> camelCaseTest
        charArr[i] = charArr[i].toUpperCase();
      }else if(toCompireType == 'snakeCase'){   //snakeCase : snakecasetest,[5,9] -> SNAKE_CASE_TEST
        charArr[i] = '_' + charArr[i];
      }else if(toCompireType == 'kebabCase'){   //snakeCase : snakecasetest,[5,9] -> SNAKE_CASE_TEST
        charArr[i] = '-' + charArr[i];
      }
    }
    
    
    
    colText += charArr[i];
  }
  if(j != colGubunIndex.length){
    console.error('파싱작업이 정상작동 하지 않았습니다.' + 'ERR.001');
  }else{
    console.log('파싱작업이 정상 작동 하였습니다. => ' +  colText);
  }
  return colText;
  
  
   
};