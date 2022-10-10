import { API_URL } from "../../settings.js"
import { sanitizeStringWithTableRows, handleHttpErrors } from "../../utils.js"

const URL = API_URL + "/members"

export function initMembers() {
  document.getElementById("tbl-body").onclick = showDetails
  getAllMembers()
}

async function getAllMembers() {
  try {
    const usersFromServer = await fetch(URL).then(handleHttpErrors)
    showAllData(usersFromServer)
  }
  catch (err) {
    console.error("UPPPPPS: " + err) //This can be done better
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(member => `
  <tr>                                
    <td>${member.username}</td>                               
    <td>${member.email} </td>  
    <td>${member.firstName} ${member.lastName} </td>
    <td>${member.ranking}</td>
    <td><button data-member=${encodeURI(JSON.stringify(member))} id="${member.id}-member-id" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#member-details-modal">Details</button> </td>      
  </tr>`
  )

  const tableRowsString = tableRowsArray.join("\n")
  document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}

function showDetails(evt) {
  const btn = evt.target;
  if (!btn.id.includes("-member-id")) {
    return
  }
  const memberAsJson = decodeURI(btn.dataset.member)
  const member = JSON.parse(memberAsJson)

  document.getElementById("user-name").innerText = member.username
  document.getElementById("email").innerText = member.email
  document.getElementById("first-name").innerText = member.firstName
  document.getElementById("last-name").innerText = member.lastName
  document.getElementById("street").innerText = member.street
  document.getElementById("city").innerText = member.city
  document.getElementById("zip").innerText = member.zip
  document.getElementById("created").innerText = member.created
  document.getElementById("edited").innerText = member.edited
  document.getElementById("ranking").innerText = member.ranking

  //  document.getElementById("member-content").innerText = memberAsJson




}

