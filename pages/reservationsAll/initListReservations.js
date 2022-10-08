import { API_URL } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"

export async function initListReservationsAll() {
  try {
    const HARDCODED_USER = "member1"
    const URL = API_URL + "/reservations/" + HARDCODED_USER
    const reservations = await fetch(URL).then(handleHttpErrors)
    const rows = reservations.map(res => `
    <tr>
      <td>${res.carId}</td>
      <td>${res.carBrand}</td>
      <td>${res.carModel}</td>
      <td>${res.rentalDate}</td>
      <td>${res.pricePrDay}</td>
    </tr>
   `).join("\n")
    const safeRows = sanitizeStringWithTableRows(rows)
    document.getElementById("tablerows").innerHTML = safeRows
  } catch (ex) {
    console.error(ex)
    alert("Please handle this in a better way!")
  }
}

