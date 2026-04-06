let input = document.querySelector("#taskInput");
let btn = document.querySelector("#addBtn");
let lst = document.querySelector("#taskList");

// console.log(input);

btn.addEventListener("click", function(){
    let task = input.value;
    // console.log("Button Clicked");
    
    if(task.trim() === ""){
        alert("Please enter the task.");
        return;
    }


    

    let li = document.createElement("li");

    li.innerText = task;
    lst.appendChild(li);

    input.value="";


   
    let delBtn = document.createElement("button");
    delBtn.innerHTML = "Delete";

    li.appendChild(delBtn);

    delBtn.addEventListener("click", function(){
        li.remove();
    })








})


