import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

const URL = API_URL + "/members"

export function initSignup() {
  document.getElementById("form").onsubmit = saveMember
  document.getElementById("goto-login").onclick = () => {
    document.getElementById("goto-login").style.display = "none"
  }
  clearInputFields()
  setStatusMsg("")
}

function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

function clearInputFields() {
  document.getElementById("input-username").value = ""
  document.getElementById("input-email").value = ""
  document.getElementById("input-password").value = ""
  document.getElementById("input-firstname").value = ""
  document.getElementById("input-lastname").value = ""
  document.getElementById("input-street").value = ""
  document.getElementById("input-city").value = ""
  document.getElementById("input-zip").value = ""
}

async function saveMember(evt) {
  evt.preventDefault()
  setStatusMsg("")
  const memberRequest = {}
  memberRequest.username = document.getElementById("input-username").value
  memberRequest.email = document.getElementById("input-email").value
  memberRequest.password = document.getElementById("input-password").value
  memberRequest.firstName = document.getElementById("input-firstname").value
  memberRequest.lastName = document.getElementById("input-lastname").value
  memberRequest.street = document.getElementById("input-street").value
  memberRequest.city = document.getElementById("input-city").value
  memberRequest.zip = document.getElementById("input-zip").value

  const postOptions = {}
  postOptions.method = "POST",
    postOptions.headers = { "Content-type": "application/json" }
  postOptions.body = JSON.stringify(memberRequest)
  try {
    const newMember = await fetch(URL, postOptions).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`Successfully created member "${newMember.username}"`)
    document.getElementById("goto-login").style.display = "block"

  } catch (err) {
    setStatusMsg(err.message, true)
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    }

  }

}
