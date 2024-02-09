let intervId; //id for clearing setInterval somewhere
document.querySelector(".nude-div").addEventListener('doneWaiting', () => {
    clearInterval(intervId)
})
document.querySelector('#submis').dataset.reference = ''

function checkBoxes() {
    if (intervId) {
        clearInterval(intervId)
    }
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
    } else {
        changingEmail(document.querySelector('#submis').dataset.reference, email2)
    }
}
function startCollect(num, mail) {
    //console.log("beforeFetch:", num, mail)
    fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: num,
            mail: mail
        })
    }).then(resp => resp.json())
        .then(response => {
            document.querySelector(".nude-div").textContent = response.message
            if (response.code == "success") {
                checkOnServer(num, mail)
            }
        })
        .catch(err => console.error(err))
}

//add provision for "if youve been deducted money but have seen no link in your email, click here. They insert phone and email again. Then we call checkOnServer with those details" No We Wont do this.
function checkOnServer(number, email) {
    intervId = setInterval(() => {
        fetch('http://localhost:3000/getfinal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: number,
                mail: email
            })
        }).then(answ => answ.json()).then(datas => {
            if (datas.code == "complete") {
                document.querySelector(".nude-div").textContent = datas.message
                document.querySelector(".nude-div").dispatchEvent(new Event('doneWaiting'))
                if (datas.refNum) {
                    document.querySelector('#submis').dataset.reference = refNum
                }
            }
        })
    }, 12000)
}

function changingEmail(refnumber, email){
    let notherChange = false
    fetch('http://localhost:3000/changemail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refNum: refnumber,
            mail: email
        })
    }).then(answ => answ.json()).then(datas => {
        if (datas.code == "complete") {
            document.querySelector(".nude-div").textContent = datas.message
            document.querySelector(".nude-div").dispatchEvent(new Event('doneWaiting'))
            if (datas.refNum) {
                notherChange = true
            }
        }
    })
    if (!notherChange) {
        document.querySelector('#submis').dataset.reference = ''
    }
}