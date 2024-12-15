
const shorthandCharas = ["7","C","A","Q","P","O","N","L","G","T","J","D","F","Y","t"];
const sheetCells = ["V7","I7","H7","S7","R7","Q7","P7","O7","L7","N7","M7","J7","K7","U7","T7"];

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("frm1").addEventListener("submit", function(e) {
        e.preventDefault() // Cancel the default action
        processSubmit();
    });
});

function processSubmit(){
    let userTranscript = document.getElementsByName('userInput')[0].value;
    let output = convertToSlotter(userTranscript);
    let copyButton = document.getElementById("copyButton");
    copyButton.value="Copy text";
    document.getElementById('result-p').innerHTML=output;
    document.getElementById('result').style.visibility='visible';
}

function convertToSlotter(transcript){
    let result="";
    let group="";
    for(let n=0; n<transcript.length;n++){
        let curr = transcript[n];
        if(shorthandCharas.includes(curr)){ //if current letter is shorthand
            if(group.length>0){
                result= result+"\""+group+"\"";
                group="";
            }
            if(result.length>0){
                result = result+"&";
            }
            result=result+sheetCells[shorthandCharas.indexOf(curr)];
        }
        else{
            if(curr.charCodeAt()==10){ //new line char code
                if(group.length>0){
                    result= result+"\""+group+"\"";
                    group="";
                }
                if(result.length>0){
                    result = result+"&";
                }
                result = result+"CHAR(10)";
                n++; //have to add an extra 1 to n so it skips the "n" of \n after looking at the "\
            }
            else if(curr.charCodeAt()==13){ //return char code
                if(group.length>0){
                    result= result+"\""+group+"\"";
                    group="";
                }
                if(result.length>0){
                    result = result+"&";
                }
                result = result+"CHAR(13)";
                n++; //have to add an extra 1 to n so it skips the "n" of \n after looking at the "\"
            }
            else{ //we add it to the group thats in quotes
                if(curr=="_"){
                    curr="□"; //if we put an underscore in the shorthand text, that means we probably can't read the actual letter. to stop it being confused with un-slotteed shorthand, we're gonna make it this square symbol :]
                }
                group=group+curr;
                if(n==transcript.length-1){
                    if(result.length>0){
                        result = result+"&";
                    }
                    if(group.length>0){
                        result= result+"\""+group+"\"";
                        group="";
                    }
                }
            }
        }
    }
    result="=("+result+")";
    return(result);
}

function copyText(){ //shoutout w3 schools https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    let textToCopy = document.getElementById("result-p");
    let copyButton = document.getElementById("copyButton");
    textToCopy.select();
    textToCopy.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textToCopy.value);
    copyButton.value="Copied!";
}