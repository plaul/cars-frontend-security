import { handleHttpErrors } from "../../utils.js"
import { API_URL } from "../../settings.js"

//Add id to this URL to get a single user
const URL = `${API_URL}/cars`

export async function initAddEditCar(match) {
  document.getElementById("btn-fetch-car").onclick = fetchCar
  document.getElementById("btn-add-car").onclick = addCar
  document.getElementById("btn-edit-car").onclick = editCar
  document.getElementById("btn-clear").onclick = clearInputFields
  document.getElementById("btn-submit-car").onclick = submitNewOrEditedCar
  document.getElementById("btn-delete-car").onclick = deleteCar
  setAddEditHeaderText("");
  if (match?.params?.id) {
    const id = match.params.id
    try {
      fetchCar(null, id)
    } catch (err) {
      setStatusMsg("Could not find user: " + id, true)
    }
  } else {
    clearInputFields()
  }
}

async function deleteCar() {
  try {
    const idForCarToDelete = document.getElementById("car-id").value
    if (idForCarToDelete === "") {
      setStatusMsg("No car found to delete", true)
      return
    }
    const options = {}
    options.method = "DELETE"
    await fetch(URL + "/" + idForCarToDelete, options)
    setStatusMsg("Car succesfully deleted", false)
    clearInputFields()
  }
  catch (err) {
    setStatusMsg(err, true)
  }
}

async function fetchCar(evt, idFromMatch) {
  setStatusMsg("", false)
  const id = idFromMatch ? idFromMatch : document.getElementById("car-id-input").value
  if (!id) {
    setStatusMsg("Please provide an id", true)
    return
  }
  try {
    const URL_FOR_ADMIN = URL + "/admin"
    const car = await fetch(URL_FOR_ADMIN + "/" + id).then(handleHttpErrors)
    renderCar(car)
    enableInputFields(false)
  } catch (err) {
    setStatusMsg("Could not find car", true)
  }
}

function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

function setAddEditHeaderText(txt) {
  document.getElementById("add-edit-header").innerText = txt
}

function renderCar(car) {
  document.getElementById("car-id").value = car.id;
  document.getElementById("brand").value = car.brand;
  document.getElementById("model").value = car.model;
  document.getElementById("price-pr-day").value = car.pricePrDay;
  document.getElementById("best-discount").value = car.bestDiscount;
}

function enableInputFields(enable) {
  if (!enable) {
    document.getElementById("brand").setAttribute("disabled", enable)
    document.getElementById("model").setAttribute("disabled", enable)
    document.getElementById("price-pr-day").setAttribute("disabled", enable)
    document.getElementById("best-discount").setAttribute("disabled", enable)
  } else {
    document.getElementById("brand").removeAttribute("disabled")
    document.getElementById("model").removeAttribute("disabled")
    document.getElementById("price-pr-day").removeAttribute("disabled")
    document.getElementById("best-discount").removeAttribute("disabled")
  }
}

function addCar() {
  setAddEditHeaderText("Add New Car")
  setStatusMsg("", false)
  clearInputFields()
}

function editCar() {
  setAddEditHeaderText("Edit Car")
  setStatusMsg("", false)
  enableInputFields(true)
}

async function submitNewOrEditedCar(evt) {
  evt.preventDefault()
  try {
    const car = {}
    car.id = document.getElementById("car-id").value
    car.brand = document.getElementById("brand").value
    car.model = document.getElementById("model").value
    car.pricePrDay = document.getElementById("price-pr-day").value
    car.bestDiscount = document.getElementById("best-discount").value

    if (car.brand === "" || car.model === "" || car.pricePrDay == "") {
      setStatusMsg(`Missing fields required for a submit`, false)
      return
    }

    const options = {}
    //If ID is set, it must be an existing car, so method is PUT
    options.method = car.id ? "PUT" : "POST"
    options.headers = { "Content-type": "application/json" }
    options.body = JSON.stringify(car)


    const FULL_URL = options.method === "PUT" ? URL + "/" + car.id : URL
    const newCar = await fetch(FULL_URL, options).then(handleHttpErrors)
    clearInputFields()
    if (options.method === "POST") {
      renderCar(newCar)
      enableInputFields(false)
      setStatusMsg(`New car with id '${newCar.id}' was added`, false)
    } else {
      setStatusMsg(`Car with id '${car.id}' was successfully edited`)

    }

  } catch (err) {
    setStatusMsg(err, true)
  }
}

function clearInputFields() {
  document.getElementById("car-id-input").value = ""
  //********************* */
  document.getElementById("car-id").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("model").value = "";
  document.getElementById("price-pr-day").value = "";
  document.getElementById("best-discount").value = "";
}