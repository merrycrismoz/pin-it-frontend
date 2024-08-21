const BASE_URL = "http://localhost:3000"

class Pin{
  constructor(pin){
    this.id = pin.id,
    this.label = pin.label,
    this.address = pin.address,
    this.latitude = pin.lat,
    this.longitude = pin.lng
  }

  indexView(){
    return `
    <br>${pin.label} - <a href= "#" onclick= 'seeAllMemoriesForPin(${this.id});'> See Memories </a>`
  }

}



function initMap(){
  var options = {
    zoom: 2,
    center: {lat: 31.478969, lng: -41.692386}
  }
  //Creates a new map
  var map = new google.maps.Map(document.getElementById('map'),options);


    fetch(BASE_URL)
    .then(response => response.json())
    .then(jsonData => {
    //iterates through each location object & sets variables
      jsonData.forEach((location) => {
          pin = {
            id: location['id'],
            label: location['label'],
            address: location['address'],
            lat: location['latitude'],
            lng: location['longitude']
            }

          pinShowOnMapView(pin)
      })
    })


  function pinShowOnMapView(pin){
      var marker = new google.maps.Marker({
        map: map,
        position: {lat: pin.lat, lng: pin.lng}
      })


      if (pin.label){
        var infoWindow = new google.maps.InfoWindow({
          content:
          `<center><strong>${pin.label}</strong>
          <br><br>
          <a href= "#" onclick= 'displayMemoryForm(${pin.id});'> Add a Memory </a><br>
          <a href= "#" onclick= 'seeAllMemoriesForPin(${pin.id});'> See Memories </a></center>
          <a href= "#" onclick= 'deleteThisPinWarning(${pin.id},"${pin.label}");'> Delete Pin </a></center>`
        });

      marker.addListener('click', function(){
          infoWindow.open(map, marker);
          // let contentContainer = document.getElementById('content-container')
          // contentContainer.innerHTML= ""
        })
      }
  }
}




//Add new pin form:
  function addAPin(){
    clearContentContainer();
    let contentContainer = document.getElementById('content-container')
    contentContainer.innerHTML = `
    <br>
    <br>
    <form onsubmit="createPin();return false;">
        <label for="label">Label as:</label><br>
        <input type="text" id="label"><br><br>
        <label for="address">Address:</label><br>
        <input type="text" id="address" ><br>
        ex. 123 Flatiron Way or Disneyland<br><br>
        <input type ="submit" value="Add Pin!"><br>
    </form>  `

  }

// Clears the form
  function clearContentContainer(){
    let contentContainer= document.getElementById('content-container')
    contentContainer.innerHTML = " "
  }

//creates a new Pin
  function createPin(){
    const pin = {
       label: document.getElementById('label').value,
       address: document.getElementById('address').value,
    }

    fetch(BASE_URL+'/pins', {
      method: "POST",
      body: JSON.stringify(pin),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    clearContentContainer();
    let contentContainer= document.getElementById('content-container')
    contentContainer.innerHTML = "<br>Refresh to update the map!"

  }


  function seeAllPins(){
    clearContentContainer();
    let contentContainer = document.getElementById('content-container')
    contentContainer.innerHTML = `
    <br>Look at all the places you've been to:<br>`
    fetch("http://localhost:3000")
    .then(response => response.json())
    .then(jsonData => {
    //iterates through each location object & sets variables
      jsonData.map((location) =>  {
        //creates a pin using above variables
        pin = {
          id: location['id'],
          address: location['address'],
          label: location['label'],
          lat: location['latitude'],
          lng: location['longitude']
          }

        let eachPin = new Pin(pin)

        if (pin.lat !== null){
        contentContainer.innerHTML += eachPin.indexView();
        }


      })
      contentContainer.innerHTML+= `
      <br>
      <br><a href= "#" onclick= 'clearContentContainer();'> Hide Locations</a>`
    })
  }



  function deleteThisPinWarning(pinId, pinLabel){
    console.log( `Are you sure you want to delete pin #${pinId}: ${pinLabel} ? Deleting this pin will delete all associated memories.`)
    let infoWindow = (event.target.parentElement)
    infoWindow.innerHTML = `
    Are you sure? Deleting this pin will delete all associated memories.<br><br>
    <a href='#' onClick= 'yesDeletePin(${pinId})'; return false;>Yes, Delete This Pin!</a><br><br>
    <a href='#' onClick= 'noDontDelete(${pinId}, "${pinLabel}")'; return false;>Just kidding! Don't Delete!</a>`

  }


  function yesDeletePin(pinId){
    fetch(BASE_URL +`/pins/${pinId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    let infoWindow = (event.target.parentElement)
    infoWindow.innerHTML = "This pin has been deleted. Refresh the page to update the map."

  }

  function noDontDelete(pinId, pinLabel){
    let infoWindow = (event.target.parentElement)
    infoWindow.innerHTML = `<center><strong>${pinLabel}</strong>
    <br><br>
    <a href= "#" onclick= 'createMemoryForm(${pinId});'> Add a Memory </a><br>
    <a href= "#" onclick= 'seeAllMemoriesForPin(${pinId});'> See Memories </a></center>
    <a href= "#" onclick= 'deleteThisPinWarning(${pinId}, "${pinLabel}");'> Delete Pin </a></center>`
  }
