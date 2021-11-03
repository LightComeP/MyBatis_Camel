document.addEventListener("load", function(){

	
});

let fGetComf:(param:string)=>any;
let fTextCamelCaseparsing:(param:null)=>null;
fGetComf = function(comfid) {
    return document.getElementById(comfid);
}



  ////////////////////////////////////////////

 

  //선언

 

  ////////////////////////////////////////////

 

 

 

 

 

  fTextCamelCaseparsing = function() {
		
	var colText 		= fGetComf('ta_col').value; //컬럼명

	var colCmText 		= fGetComf('ta_colCommand').value; //컬럼커멘드

    var gubunText 		= fGetComf('ibx_gubun').value; //구분자

	var objresultDiv 	= fGetComf('resultDiv');

	var maxLength:number		= 0;

 

	document.cookie = 'colText='+colText;

 

    var colArr 		= colText.split(gubunText); //컬럼 나누기

	var colCmArr	= colCmText.split(gubunText);

	

    var resultColArr:string[] 		= [];

    var resultColCmArr				= [];

 

	var resultText = "";

 

 

    document.cookie = 'col=' + colText;

//////////////////////////////////////////////

//colArr 생성

	

    for (var col of colArr) {		// 

		var colflag = true; // flag 선언

		col.replaceAll(" ", ""); // 공백 제거

 

		if (col == "") {

			continue; // 공백이라면 포함 X

		}

 

		col = col.toLowerCase(); // 소문자로 변환

 

		while (colflag) {

			var ui = col.indexOf("_"); //UpperIndex

			if (ui < 0) {

			colflag = false;

			continue;

			}

			col = col.slice(0, ui) + col.slice(ui + 1, ui + 2).toUpperCase() + col.slice(ui + 2);

		}

		if(col.length > maxLength){

			maxLength = col.length;

			var spaceLength = ((maxLength/4)+1);

 

			

		}

		resultColArr.push(col);
		return null;
    }

	

//////////////////////////////////////////////

//colCmArr 생성

	for(var i = 0; i < colCmArr.length; i++){		//colCmArr 생성

		resultColCmArr[i] = colCmArr[i].replaceAll(" ", "");

	}

	 

//////////////////////////////////////////////

//노출 데이터 생성

	

 

	for(var i = 0; i < resultColArr.length; i++ ){

		var spaceString = '';
		var colLength:number = resultColArr[i].length;
		Math.ceil(colLength);
		
		
		for(var j = 0; j <= spaceLength - Math.ceil(colLength / 4); j++){

			debugger;

			spaceString += '\t';

		}

		if(resultColCmArr[i] == null || resultColCmArr[i] == 'undefined'){

			resultColCmArr[i] = '';

		}

		resultText += (resultColArr[i] + spaceString + resultColCmArr[i] + '\n');

	}

	fGetComf('resultDiv').value = resultText;

	

	

  }