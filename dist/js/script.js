//radio 기본값 세팅
common.setRdoValue('rdo_parsingType',0); // basic;


common.getComf('ta_col').value = 'WORK_REQ_LIST WORK_SET_DATE WORK_REQ_DTTM'
  ////////////////////////////////////////////
  //선언
  ////////////////////////////////////////////

//////////////////// 데이터 파싱 시작
fTextCamelCaseparsing = async function() { // 데이터 파싱
  /////////////선언부
  let tableName     = common.getComf('ibx_tableName').value;
	var colText 		  = common.getComf('ta_col').value;           //컬럼 값
	var colCmText 		= common.getComf('ta_colCommand').value;  //컬럼 코멘드 값
  var gubunText 		= common.getComf('ibx_gubun').value;      //구분자 값
	var objresultDiv 	= common.getComf('resultDiv');            //결과 textArea Ele
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



  





