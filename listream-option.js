async function main(){
    while(!document.querySelector('#app > main > section > div > section[class^="actionsbar"] > div > div[class^="left"] > div > div > div > ul')) {
      await new Promise(r => setTimeout(r, 1000));
    console.log("not found")
    }
    
    function addbutton(){
        var element = document.querySelector('#app > main > section > div > section[class^="actionsbar"] > div > div[class^="left"] > div > div > div > ul');
    
        var li = document.createElement("li");
        var i = document.createElement("i");
        var span1 = document.createElement("span")
        var span2 = document.createElement("span")
        var span3 = document.createElement("span")
        span1.id = "modal-btn"
        // li
        li.setAttribute("tabindex", "0")
        li.setAttribute("aria-labelledby", "dropdown-item-label-67")
        li.setAttribute("aria-describedby", "dropdown-item-desc-68")
        li.className = "item--yl1AH"
        li.setAttribute("role", "menuitem")
    // i
        i.classList =  "itemIcon--Z207zn1 icon-bbb-video"
    // span1
        span1.className = "itemLabel--Z12glHA"
        span1.appendChild(document.createTextNode("Stream"))
    // span2
        span2.id = "dropdown-item-label-67"
        span2.setAttribute("hidden"," ")
        span2.appendChild(document.createTextNode("Stream"))
    // span3
        span3.id = "dropdown-item-desc-68"
        span3.setAttribute("hidden"," ")
        span3.appendChild(document.createTextNode("stream"))
    
        li.appendChild(i)
        li.appendChild(span1)
        li.appendChild(span2)
        li.appendChild(span3)
        element.appendChild(li)
    }
    function addmodal(){
    // modal
        // var element = document.querySelector('#app > main > section > div > section[class^="actionsbar"] > div > div[class^="left"] > div > div > div > ul');
        var mdiv1 = document.createElement("div")
        var mdiv2 = document.createElement("div")
        var mdiv3 = document.createElement("div")
        var mdiv4 = document.createElement("div")
        var mspan = document.createElement("span")
        var mh1 = document.createElement("h1")
        var minput = document.createElement("input")
        var mh2 = document.createElement("h2")
    
        mdiv1.className = "modal"
        mdiv2.className = "modal-heade"
        mdiv3.className = "modal-content"
        mdiv4.className = "modal-footer"
        mspan.className = "close-btn"
        mspan.appendChild(document.createTextNode("&times;"))
        mh1.appendChild(document.createTextNode("Start stream"))
        minput.setAttribute("placeholder", "rtmp url")
        mh2.appendChild(document.createTextNode("I am the Footer"))
        mdiv2.appendChild(mspan)
        mdiv2.appendChild(mh1)
        mdiv3.appendChild(minput)
        mdiv4.appendChild(mh2)
        mdiv1.appendChild(mdiv2)
        mdiv1.appendChild(mdiv3)
        mdiv1.appendChild(mdiv4)
        document.getElementsByTagName("body")[0].appendChild(mdiv1)
    }
    addbutton()
    addmodal()
    
    let modalBtn = document.getElementById("modal-btn")
    let modal = document.querySelector(".modal")
    let closeBtn = document.querySelector(".close-btn")
    modalBtn.onclick = function(){
      modal.style.display = "block"
    }
    closeBtn.onclick = function(){
      modal.style.display = "none"
    }
    window.onclick = function(e){
      if(e.target == modal){
        modal.style.display = "none"
      }
    }
    }
    main()