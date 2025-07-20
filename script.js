let prompt=document.querySelector("#prompt");
let chatContainer=document.querySelector(".chat-container");
let imagebtn=document.querySelector("#image");
let imageinput=document.querySelector("#image input");
const Api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBcwV6f_qKKqFY_uZn8zz5DDHu3GURS7UQ";
let user={
    message:null,
    file: {
      mime_type:null,
      data:null
    }
}
async function generateResponse(aiChatBox){
    let parts = [];
    parts.push({ "text": user.message });
    if (user.file.data) {
      parts.push({ "inline_data": user.file });
    }
    let RequestOptions={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  },
        body: JSON.stringify({
    "contents": [
      {
        "parts": parts
      }
    ]
  })
    };
    // Send the request to the API
       try {
            let response=fetch(Api_url,RequestOptions);
            let data=await (await response).json();
            let botResponse=data.candidates[0].content.parts[0].text;
            console.log("Bot Response:", botResponse);
            aiChatBox.querySelector(".bot-chat-text").textContent = botResponse;
       }
         catch (error) {
            console.error("Error:", error);
            aiChatBox.querySelector(".bot-chat-text").textContent = "Error generating response.";
       } 
       finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
       }

}
function CreateChatBox(html, className){
   let div=document.createElement("div");
   div.className=className;
   div.innerHTML=html;
   return div
}

function handleChatResponse(message){
    user.message=message; // Store the user message in the user object
   let html=` <div class="user-chat-box">
            <img src="person.png" alt="userImage" id="userImage" width="80"> 
            <div class="user-chat-area">
            <p class="user-chat-text">${user.message}</p>
            </div>`
            let userChatBox=CreateChatBox(html,"user-chat-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

}

prompt.addEventListener("keydown", function(event) {  
    if(event.key=="Enter"){
       handleChatResponse(prompt.value);
       prompt.value=null; // Clear the input field after sending the message

       setTimeout(() => {
           let html=`<div class="ai-chat-box">
            <img src="chatbot.png" alt="chatbotImage" id="botImage" width="80"> 
            <div class="ai-chat-area">
            <p class="bot-chat-text">This is a bot response.</p>
            <div id="loading">
                 <img src="loading.gif" alt="Loading..." width="50" 
                 style="
                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                 padding-top: 10px;
                 border-radius: 40px 40px 30px 30px ;
            </div>
             ">`
            let aiChatBox=CreateChatBox(html,"bot-chat-box");
            chatContainer.appendChild(aiChatBox);
            
            generateResponse(aiChatBox);
       }, 600); // Simulate a delay for the bot response
    }
    });

    imageinput.addEventListener("change", () => {
      const file = imageinput.files[0];
      if (!file) return;
      let reader = new FileReader();
      reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
          mime_type: file.type, // FIXED
          data: base64string
        };
      };
      reader.readAsDataURL(file);
    })
imagebtn.addEventListener("click", () => {
    imageinput.click(); // open file dialog when button is clicked
});