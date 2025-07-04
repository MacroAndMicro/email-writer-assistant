console.log("Email Writer Assistant Extension Loaded");

findComposeToolbar = () => {
  const selectors = [
    '.aDh', 
    '.btC', 
    '[role="toolbar"]',
    '.gU.Up' 
  ];
  for(const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if(toolbar) {
      return toolbar;
    }
    return null;
  }
}


function getEmailContent () {
  /*const selectors = [
    '.a3s.ail.', 
    '.h7', 
    'gmail_quote',
    '[role="presentation"]' 
  ];*/
  const selectors = [
  '.a3s.aiL ', // updated if needed
  '.a3s.ail ',
  '.ii.gt',
  'blockquote.gmail_quote'
];
  for(const selector of selectors) {
    const content = document.querySelector(selector);
    if(content && content.innerText.trim()) {
      return content.innerText.trim();
    }
  }
    return '';
}



createAIButton = () => {
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
  button.style.marginRight =' 8px';
  button.innerHTML='AI Reply';
  button.setAttribute('role', 'button');
  //button.setAttribute('data tooltip', 'Generate AI Reply');
  button.setAttribute('title', 'Generate AI Reply');
  return button;
}



//const button = createAIButton();

const injectButton = () => {
  const existingButton = document.querySelector('.ai-reply-button');
  if(existingButton) existingButton.remove();
  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }
  console.log("Toolbar found, injecting button");
  const button = createAIButton();
  button.classList.add('ai-reply-button');
  button.addEventListener('click', async () => {
   try{
    button.innerHTML = 'Generating...';
    button.disabled = true;

    const emailContent = getEmailContent();
    const response = await fetch('http://localhost:8080/api/email/generate',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        emailContent : emailContent,
        tone : "sarcastic"
       })
    });

    if (!response.ok) {
      throw new Error('api request failed');
    }

    const generatedReply = await response.text();
    const composedBox = document.querySelector('[role="textbox"][g_editable="true"]');
    console.log("Generated Reply:", generatedReply);
    if(composedBox){
      composedBox.focus();
      document.execCommand('insertText', false, generatedReply);
    }
    else {
      console.error("Composed box not found");
    } 
   }
   catch (error){
    console.error("Error generating reply:", error);
    alert("Error generating reply. Please try again later.");
   }
   finally{
    button.innerHTML = 'AI Reply';
    button.disabled = false;
   }
  });


  toolbar.insertBefore(button, toolbar.firstChild);
};


const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(node =>
    node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDc, .btC, [role="dialog"]'))
    );

    if (hasComposeElements) {
  console.log("compose window detected");
  try {
    setTimeout(injectButton, 500);
  } catch (error) {
    console.error(error);
    alert("Error injecting button. Please try again later.");
  }finally{
    button.innerHTML='AI Reply';
    button.disabled = false;
  }
}

 }
});


observer.observe(document.body, {
  childList: true,
  subtree: true
});