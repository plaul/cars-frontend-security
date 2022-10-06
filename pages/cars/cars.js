import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/cars/admin"


export async function initCars() {
  const cars = await fetch(URL).then(handleHttpErrors)
  document.getElementById("table-rows").onclick = gotoToAddEditView
  const carRows = cars.map(car => `
  <tr>
  <td>${car.id}</td>
  <td>${car.brand}</td>
  <td>${car.model}</td>
  <td>${car.pricePrDay}</td>
  <td>${car.bestDiscount}</td>
  <td><button id="${car.id}-column-id" class="btn btn-sm btn-secondary">Edit/delete</button> </td>      
  </tr>
  `).join("/n")

  const safeRows = sanitizeStringWithTableRows(carRows);
  document.getElementById("table-rows").innerHTML = safeRows

  async function gotoToAddEditView(evt) {
    const target = evt.target
    //Verify that it was a Edit/Delete button that was clicked
    if (!target.id.includes("-column-id")) {
      return
    }
    const id = target.id.replace("-column-id", "")
    window.router.navigate("add-edit-car?id=" + id)
  }
}
