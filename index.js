//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo.js"  //Will create the global Navigo object used below


import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadHtml
} from "./utils.js"

import { initReservation } from "./pages/reservation/reserve.js"
import { initUsers } from "./pages/users/users.js"
import { initCars } from "./pages/cars/cars.js"
import { initLogin } from "./pages/login/login.js"
import { initAddEditCar } from "./pages/editCar/handleEditCar.js"
import { initListReservationsAll } from "./pages/reservationsAll/initListReservations.js"

window.addEventListener("load", async () => {

  const templateAbout = await loadHtml("./pages/about/about.html")
  const templateCars = await loadHtml("./pages/cars/cars.html")
  const templateUsers = await loadHtml("./pages/users/users.html")
  const templateSignup = await loadHtml("./pages/signup/signup.html")
  const templateLogin = await loadHtml("./pages/login/login.html")
  const templateEditCar = await loadHtml("./pages/editCar/editCar.html")
  const templateReserve = await loadHtml("./pages/reservation/reserve.html")
  const templateReservations = await loadHtml("./pages/reservationsAll/listReservations.html")
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")

  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => document.getElementById("content").innerHTML =
        `<h2>Home</h2>
      <p style='margin-top:2em'>
      This is the content of the Home Route
      </p>
     `,

      "/cars": () => {
        renderTemplate(templateCars, "content")
        initCars()
      },
      "/find-edit-car": (match) => {
        renderTemplate(templateEditCar, "content")
        initAddEditCar(match)
      },

      "/reserve-car": () => {
        renderTemplate(templateReserve, "content")
        initReservation()
      },
      "/reservations": () => {
        renderTemplate(templateReservations, "content")
        initListReservationsAll()
      },
      "/signup": () => {
        renderTemplate(templateSignup, "content")
      },
      "/login": (match) => {
        renderTemplate(templateLogin, "content")
        initLogin()
      }
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}