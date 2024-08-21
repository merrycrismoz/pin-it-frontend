class Memory {
  constructor(memory){
    this.id = memory.id
    this.date = memory.date,
    this.description = memory.description,
    this.pin_id = memory.pin_id
  }

  memoryIndexView(){
    console.log(`I have memory id: ${this.id}, memory date:${this.date}, memory description: ${this.description}, and a pin_id of ${this.pin_id}.`)
    return `<br>${this.date}| ${this.description} | <a href='#' onClick='editThisMemory(${this.id})'; return false;>Edit</a> | <a href='#' onClick='deleteThisMemoryWarning(${this.id}, ${this.pin_id})'; return false;>Delete</a><br>
    `
  }


  memoryShowView(){
    console.log(`The memoryShowView function has been triggered. You should see your memory displayed below the map. The memory has an id of ${this.id} and belongs to pin_id ${this.pin_id} `)
    return `
    <br>Date:
    <br>${this.date}
    <br>
    <br>Description:
    <br>${this.description}
    <br>
    <br><a href='#' onClick='editThisMemory(${this.id})'; return false;>Edit this Memory</a>
    <br><a href= "#" onClick= 'deleteThisMemoryWarning(${this.id}, ${this.pin_id});'>Delete Memory</a>
    <br>
    <br><a href= "#" onclick= 'seeAllMemoriesForPin(${this.pin_id});'> All Memories at this Location</a></center>
    `
  }

  memoryEditView(){
    return   `
        <br>
          <form onsubmit="updateMemory(${this.id});return false;">
          <label>Date:</label><br>
          <input type ="text" id="date" value="${this.date}"></br><br>
          <label>Description:</label><br>
          <input type ="text" id="description" value = "${this.description}"></br><br>
          <input type="hidden" id="pin_id" value=${this.pin_id} >
          <input type ="submit" value="Submit">
      `
  }


}


function clearContentContainer(){
  let contentContainer = document.getElementById('content-container')
  contentContainer.innerHTML = ""
}

function displayMemoryForm(pinId){
  //for debugging purposes:
  console.log(`The function displayMemoryForm has been triggered.This pin has an id of ${pinId}`)

  let contentContainer = document.getElementById('content-container')
  contentContainer.innerHTML =  `
      <br>
      Add your memory to this location by filling out the form below:
      <br>
      <br>
      <form onsubmit="createAndDisplayMemory();return false;">
        <label for="date">Date (YYYY-MM-DD)</label><br>
        <input type="text" id="date"><br>
        <label for="description">Description:</label><br>
        <input type="text-area" id="description" ><br>
        <input type="hidden" id="pin_id" value=${pinId} >
        <input type ="submit" value="Add Memory!"><br>
    </form>  `
}



function createAndDisplayMemory(){
  let contentContainer = document.getElementById('content-container')

  const memory = {
    date: document.getElementById('date').value,
    description: document.getElementById('description').value,
    pin_id: document.getElementById('pin_id').value
  }

  console.log(`The createAndDisplayMemory function has been triggered. I have access to the pin_id ${memory.pin_id}`)

  fetch(BASE_URL+'/memories', {
    method: "POST",
    body: JSON.stringify(memory),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(memory => {
    clearContentContainer();
    let newMemory = new Memory(memory)
    contentContainer.innerHTML = newMemory.memoryShowView()


  })
  
}


function seeAllMemoriesForPin(pinId, memoryId){
  console.log(`This pin has an id of ${pinId}`)
  let contentContainer = document.getElementById('content-container')
  clearContentContainer();

  fetch(BASE_URL+`/pins/${pinId}`)
    .then(response => response.json())
    .then(pin => {
      if (pin.memories[0] != null) {
        for (let i=0; i < pin.memories.length; i++){

          let memory = {
            id: pin.memories[i].id,
            date: pin.memories[i].date,
            description: pin.memories[i].description,
            pin_id: pin.id
          }

          let eachMemory = new Memory(memory)
          contentContainer.innerHTML += eachMemory.memoryIndexView()
          console.log(eachMemory)
        }
      } else {
        contentContainer.innerHTML = `<br>You don't currently have any memories at this location!<br>
        `
      }
      contentContainer.innerHTML += `
      <br><a href= "#" onClick= 'seeAllPins(); return false;'>Go to All Locations</a>
      <br><a href= "#" onclick= 'clearContentContainer();'> Hide this Message</a>
      <br>
      <br>
    `
      let orderButton = document.createElement('button')
      orderButton.id = "order-alphabetically-btn"
      orderButton.innerHTML = "Order Memories Alphabetically"
      contentContainer.appendChild(orderButton)
      orderButton.addEventListener('click', function(){
        clearContentContainer();
        orderAlphabetically(pinId);

      })

  })

}


function orderAlphabetically(pinId){
  let contentContainer = document.getElementById('content-container')
  console.log(`You're IN ${pinId}`)
  fetch(BASE_URL+`/pins/${pinId}`)
  .then(response => response.json())
  .then(pin => {
    if (pin.memories[0] != null) {
      console.log(pin.memories)
      let pinsArray = pin.memories.sort(function(a,b) {
        var x = a.description.toLowerCase();
        var y = b.description.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })

        for (let i=0; i < pin.memories.length; i++){

        let memory = {
          id: pinsArray[i].id,
          date: pinsArray[i].date,
          description: pinsArray[i].description,
          pin_id: pinsArray[i].pin_id
        }

        let eachMemory = new Memory(memory)
        contentContainer.innerHTML += eachMemory.memoryIndexView()
        console.log(eachMemory)
      }
    } else {
      contentContainer.innerHTML = `<br>You don't currently have any memories at this location!<br>
      `
    }
    contentContainer.innerHTML += `
    <br><a href= "#" onClick= 'seeAllPins(); return false;'>Go to All Locations</a>
    <br><a href= "#" onclick= 'clearContentContainer();'> Hide this Message</a>`

  })
}




function editThisMemory(memoryId){
  console.log(`This memory has an id of ${memoryId}`)
  let contentContainer = document.getElementById('content-container')
  contentContainer.innerHTML = ""
    fetch(BASE_URL + `/memories/${memoryId}`)
    .then(resp => resp.json())
    .then(memory =>
      {
        let memoryForUpdate = new Memory(memory)
        contentContainer.innerHTML = memoryForUpdate.memoryEditView();
      }
    )
}



function updateMemory(memoryId){
  console.log(`Is this the same memory as above? ${memoryId}`)

  let contentContainer = document.getElementById('content-container')

  const memory = {
    date: document.getElementById('date').value,
    description: document.getElementById('description').value,
    pin_id: document.getElementById('pin_id').value
  }


  fetch(BASE_URL + `/memories/${memoryId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(memory)
    })
    .then(response => response.json())
    .then(memory => {
      let updatedMemory = new Memory(memory)
      clearContentContainer();
      contentContainer.innerHTML = updatedMemory.memoryShowView();

    })

}



function deleteThisMemoryWarning(memoryId, pinId){
  console.log(`The current memory id is ${memoryId}, and it is associated with pin id ${pinId}`)
  clearContentContainer();
  let contentContainer = document.getElementById('content-container')
  contentContainer.innerHTML += `
  <br>
  Are you sure you want to delete this memory?<br><br>
  <a href='#' onClick= 'yesDeleteMemory(${memoryId}, ${pinId})'; return false;>Yes, Delete This Memory!</a><br><br>
  <a href='#' onClick= 'noDontDeleteMemory(${memoryId}, ${pinId})'; return false;>No, take me back!</a>
  `
}


function yesDeleteMemory(memoryId, pinId){
  console.log(`The current memory id is ${memoryId}`)
  let contentContainer = document.getElementById('content-container')
  contentContainer.innerHTML = ""
  fetch(BASE_URL +`/memories/${memoryId}`, {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
  })
  contentContainer.innerHTML = `
  This memory has been deleted.
  <br>
  <br><a href= "#" onclick= 'seeAllMemoriesForPin(${pinId});'> <--- Back </a></center>
`
}



function noDontDeleteMemory(memoryId, pinId){
  let contentContainer = document.getElementById('content-container')
  clearContentContainer();
  seeAllMemoriesForPin(pinId, memoryId)
}
