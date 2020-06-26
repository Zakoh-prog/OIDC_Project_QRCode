var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var messChargement = document.getElementById("messChargement");
var token = document.getElementById("token");

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

navigator.mediaDevices.getUserMedia({ video: {facingMode:"environment"} }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); 
    video.play();
    requestAnimationFrame(tick);
});

function tick() {
    var payload="";
    var signature="";
    messChargement.innerText = "⌛ Chargement de la vidéo..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        messChargement.hidden = true;
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

                signature=code.data;
                payload = getCookie("payload");
                var pointos=0;
                if(signature != payload){
                    for (let i = 0; i < signature.length; i++) {
                        if(signature[i]=="."){
                            pointos = i;
                        }
                    }

                    var header = signature.slice(0,pointos);
                    signature = signature.slice(pointos);
                    var qrcode = header + payload + signature ;
                    token.innerText=qrcode;
                    
                    
                }
        }
    }
    requestAnimationFrame(tick);
}