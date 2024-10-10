//starting the server
const serv = 'https://one-client.onrender.com'

try {
  fetch(serv, {
    method: 'OPTIONS'
  })
} catch (e) {
  console.log('failing to send options preflight')
}

document.querySelector('#submis').dataset.reference = ''

function checkBoxes() {

  const email1 = document.getElementById("email1").value.trim();
  const email2 = document.getElementById("email2").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (email1 === "" || email2 === "" || phone === "") {
    document.querySelector(".nude-div").textContent = "Please input all required fields";
    return;
  }
  if (email1 !== email2) {
    document.querySelector(".nude-div").textContent = "Emails submitted are not similar. Please check emails and re-submit.";
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
  if (!emailRegex.test(email2)) {
    document.querySelector(".nude-div").textContent = "Please enter a valid email and try again";
    return;
  }
  const phoneRegex = /^\d{9}$/; // Regex for a 9-digit number
  if (!phoneRegex.test(phone)) {
    document.querySelector(".nude-div").textContent = "Please enter a valid 9-digit phone number";
    return;
  }

  document.querySelectorAll('input').forEach(e => e.value = '')
  if (!document.querySelector('#submis').dataset.reference) {
    startCollect(phone, email2);
  }
}

async function startCollect(num, mail) {
  try {
    const response = await fetch(`${serv}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: num,
        email: mail
      })
    })

    const data = await response.json()

    document.querySelector(".nude-div").textContent = data.message || data.error
    if (response.status === 200) {
      window.location.href = data.redirect
    } else {
      throw new Error('the response was not 200', response)
    }

  } catch (err) {
    console.error(err)
  }
}
