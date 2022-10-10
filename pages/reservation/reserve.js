
import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/cars"


export async function initReservation() {
  try {
    const cars = await fetch(URL).then(handleHttpErrors)
    document.getElementById("table-rows").onclick = setupReservationModal
    const carRows = cars.map(car => `
  <tr>
  <td>${car.id}</td>
  <td>${car.brand}</td>
  <td>${car.model}</td>
  <td>${car.pricePrDay}</td>
  <td><button data-car=${JSON.stringify(car)} id="${car.id}-car-id" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#reservation-modal">Reserve car</button> </td>      
  </tr>
  `).join("\n")

    const safeRows = sanitizeStringWithTableRows(carRows);
    document.getElementById("table-rows").innerHTML = safeRows
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true, "error")
    } else {
      setStatusMsg(err.message + " (Is the API online)", true, "error")
      console.error(err.message + " (Is the API online)")
    }
  }
}

async function setupReservationModal(evt) {
  const btn = evt.target
  if (!btn.id.includes("-car-id")) {
    return //Not a reserve button that was clicked
  }
  const car = JSON.parse(btn.dataset.car)
  const headerText = `Reserve car: (${car.id}), ${car.brand}, ${car.model}, price: ${car.pricePrDay}`
  document.getElementById("reservation-modal-label").innerText = headerText
  document.getElementById("car-id").value = car.id

  document.getElementById("user-name").value = ""
  document.getElementById("reservation-date").value = ""
  setStatusMsg("", false)
  document.getElementById("btn-reservation").onclick = reserveCar
}

async function reserveCar() {
  const URL = API_URL + "/reservations"
  const reservationRequest = {}
  reservationRequest.carId = document.getElementById("car-id").value
  reservationRequest.username = document.getElementById("user-name").value
  reservationRequest.date = document.getElementById("reservation-date").value
  const fetchOptions = {}
  fetchOptions.method = "POST"
  fetchOptions.headers = { "Content-Type": "application/json" }
  fetchOptions.body = JSON.stringify(reservationRequest)
  try {
    await fetch(URL, fetchOptions).then(handleHttpErrors)
    setStatusMsg("Car was succesfully reserved, enter a new date, or press close", false)

  } catch (ex) {
    const errorMsg = ex.apiError ? ex.apiError.message : ex.message
    setStatusMsg(errorMsg, true)
  }
}

function setStatusMsg(msg, isError, node) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = node ? document.getElementById(node) : document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}