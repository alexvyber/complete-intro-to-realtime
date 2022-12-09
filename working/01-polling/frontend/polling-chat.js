const chat = document.getElementById("chat")
const msgs = document.getElementById("msgs")

// let's store all current messages here
let allChat = []

// the timeout to poll at in milliseconds
const TIMEOUT = 1000

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault()
  postNewMsg(chat.elements.user.value, chat.elements.text.value)
  chat.elements.text.value = ""
})

async function postNewMsg(user, text) {
  const data = { user, text }

  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }

  /* const res = */ await fetch("/poll", options)
  // const json = await res.json()
}

let count = 0
async function getNewMsgs() {
  let json

  try {
    const res = await fetch("/poll")
    json = await res.json()
  } catch (e) {
    console.error(e)
  }
  allChat = json.msg

  render()
  console.log(++count)
  // setTimeout(getNewMsgs, TIMEOUT)
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  )
  msgs.innerHTML = html.join("\n")
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`

// make the first request
let timeToMakeNextRequest = 0
async function rafTimer(time, callback) {
  if (timeToMakeNextRequest <= time) {
    await callback()
    timeToMakeNextRequest = time + TIMEOUT
  }

  requestAnimationFrame(time => {
    rafTimer(time, callback)
  })
}

requestAnimationFrame(time => rafTimer(time, getNewMsgs)) // ???: Learn more...
