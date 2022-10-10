import { handleHttpErrors } from "../../utils.js"
import { API_URL } from "../../settings.js"

//Add id to this URL to get a single user
const URL = `${API_URL}/cars`

export async function initAddCar(match) {
  document.getElementById("form").onsubmit = submitCar
  clearInputFields()
}

function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

function addCar() {
  setStatusMsg("", false)
  clearInputFields()
}

async function submitCar(evt) {
  evt.preventDefault()

  try {
    const car = {}
    car.brand = document.getElementById("brand").value
    car.model = document.getElementById("model").value
    car.pricePrDay = document.getElementById("price-pr-day").value
    car.bestDiscount = document.getElementById("best-discount").value

    if (car.brand === "" || car.model === "" || car.pricePrDay == "") {
      setStatusMsg(`Missing fields required for a submit`, true)
      return
    }

    const options = {}
    //If ID is set, it must be an existing car, so method is PUT
    options.method = "POST"
    options.headers = { "Content-type": "application/json" }
    options.body = JSON.stringify(car)

    const newCar = await fetch(URL, options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`${newCar.brand}, ${newCar.model} with id '${newCar.id}' was successfully added`)

  } catch (err) {
    setStatusMsg(err, true)
  }
}

function clearInputFields() {
  document.getElementById("brand").value = "";
  document.getElementById("model").value = "";
  document.getElementById("price-pr-day").value = "";
  document.getElementById("best-discount").value = "";
}