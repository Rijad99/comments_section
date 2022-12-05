//Change user

// const loggedInUser = {
//     id: 19,
//     username: "maxblagun",
//     avatar: "maxblagun.png"
// }

const loggedInUser = {
    id: 20,
    username: "amyrobson",
    avatar: "amyrobson.png"
}



if (JSON.parse(localStorage.getItem("comments")) === null) {
    localStorage.setItem("comments", JSON.stringify([]))
}

if (JSON.parse(localStorage.getItem("replies")) === null) {
    localStorage.setItem("replies", JSON.stringify([]))
}



const drawComments = (commentsData, repliesData) => {
    const commentsContainer = document.getElementById("comments")

    commentsData.forEach((d, i) => {
        const numberOfLetters = d.content.comment.split(" ").join("").length
        
        const comment = document.createElement("div")
        comment.id = `comment-${d.user.id}-${d.content.id}`
        comment.className = "card comment-card"

        comment.innerHTML = `
            <div class="button-group-vote">
                <button class="btn-vote-up" onclick=voteUp(${d.content.id})>
                    <img src="../images/icon-plus.svg" />
                </button>
                <span id="comment-${d.content.id}-votes">${d.content.votes}</span>
                <button class="btn-vote-down" onclick=voteDown(${d.content.id})>
                    <img src="../images/icon-minus.svg" />
                </button>
            </div>
            <div class="comment">
                <div class="comment-header">
                    <div class="user-info">
                        <div class="circle">
                            <img src="../images/avatars/image-${d.user.avatar}" />
                        </div>
                        <span class="name">${d.user.username}</span>

                        ${d.user.id === loggedInUser.id ?
                            
                            `<span class="you">you</span>`
                        
                        : ""}

                        <span class="date">${d.content.createdAt}</span>
                    </div>

                    ${d.user.id === loggedInUser.id ?
                        
                        `
                            <div class="button-group">
                                <button class="btn btn-save-changes"><img src="../images/icon-save.svg" class="icon-save" /></button>
                                <button class="btn btn-delete" onclick=createDeleteModal(${d.content.id})><img src="../images/icon-delete.svg" />Delete</button>
                            </div>
                        `

                    : `<button class="btn btn-reply"><img src="../images/icon-reply.svg" />Reply</button>`}    

                </div>

                <div class="comment-body">

                        ${d.user.id === loggedInUser.id ?
                        
                            `<p contenteditable=true class="my-comment" spellcheck="false" onkeyup="editComment(event, ${d.content.id})">${d.content.comment}</p>`
                        
                        : `<p>${d.content.comment}</p>`}                  
                    
                    ${numberOfLetters > 130 ? 
                    
                        `<div class="popover">${d.content.comment}</div>`
                    
                    : ""}

                </div>

                ${repliesData.length > 0 ?           
                    `
                        <div class="comment-footer">

                            ${d.content.repliesBy.length > 0 ?
                            
                                `<div class="replies">
                                
                                    ${
                                        d.content.repliesBy.length > 2 
                                        ?           
                                        (d.content.repliesBy.slice(0, 2).join(", ") + " and " + d.content.repliesBy.slice(2, d.content.repliesBy.length).length + " others replied to this comment.") 
                                        : 
                                        d.content.repliesBy.length === 1 ? (d.content.repliesBy + " replied to this comment.") : d.content.repliesBy.length === 2 
                                        && 
                                        (d.content.repliesBy.join(" & ") + " replied to this comment.")}

                            </div>`

                            : ""}

                            ${repliesData[i].replies.length > 0 ?
                            
                                `<button id="btn-expand" class="btn btn-expand" onclick="expandReplies(${d.content.id})">Expand</button>`

                            : ""}
                            
                        </div>
                    `
                    : ""}
            </div>
        `

        commentsContainer.appendChild(comment)
    })
}

const drawReplies = (repliesData, commentsData) => {

    if (repliesData.length > 0) {

        commentsData.forEach((d, i) => {

            const repliedCommentsContainer = document.createElement("div")
            repliedCommentsContainer.className = "replied-comments"
            repliedCommentsContainer.id = `replied-comments-${d.content.id}`

            let commentToAddReplyTo = document.getElementById(`comment-${d.user.id}-${d.content.id}`)

            repliesData[i].replies.forEach((r, j) => {    

                const repliedComment = document.createElement("div")
                repliedComment.id = `comment-${r.user.id}-${r.content.id}-20`
                repliedComment.className = "card comment-card"

                    const numberOfLetters = r.content.comment.split(" ").join("").length

                    repliedComment.innerHTML = `
                    <div class="button-group-vote">
                        <button class="btn-vote-up" onclick=voteUp(${r.content.id})>
                            <img src="../images/icon-plus.svg" />
                        </button>
                        <span id="comment-${r.content.id}-votes">${r.content.votes}</span>
                        <button class="btn-vote-up" onclick=voteDown(${r.content.id})>
                            <img src="../images/icon-minus.svg" />
                        </button>
                    </div>
                    <div class="comment">
                        <div class="comment-header">
                            <div class="user-info">
                                <div class="circle">
                                    <img src="../images/avatars/image-${r.user.avatar}" />
                                </div>
                                <span class="name">${r.user.username}</span>
                                
                                ${r.user.id === loggedInUser.id ?
                                
                                    `<span class="you">you</span>`
                                
                                : ""}

                                <span class="date">${r.content.createdAt}</span>
                            </div>

                            ${r.user.id === loggedInUser.id ?
                            
                                `
                                    <div class="button-group">
                                        <button class="btn btn-save-changes"><img src="../images/icon-save.svg" class="icon-save" /></button>
                                        <button class="btn btn-delete" onclick=createDeleteModal(event, ${r.content.id})><img src="../images/icon-delete.svg" />Delete</button>
                                    </div>
                                `

                            : `<button class="btn btn-reply"><img src="../images/icon-reply.svg" />Reply</button>`}       
                                            
                        </div>

                        <div class="comment-body">

                            ${r.user.id === loggedInUser.id ?
                            
                                `<p contenteditable=true class="my-comment" spellcheck="false" onkeyup="editComment(event, ${r.content.id})">${r.content.comment}</p>`
                            
                            : `<p>${r.content.comment}</p>`}          

                            ${numberOfLetters > 130 ? 
                        
                                `<div class="popover">${r.content.comment}</div>`
                            
                            : ""}

                        </div>
                    </div>
                `

                repliedCommentsContainer.appendChild(repliedComment)                                                    
            })

            commentToAddReplyTo.after(repliedCommentsContainer)
        })
    }
}

const deleteComment = id => {
    const comment = document.getElementById(`comment-${loggedInUser.id}-${id}`)

    comment.remove()

    const commentsFromLocalStorage = JSON.parse(localStorage.getItem("comments"))
    const newComments = commentsFromLocalStorage.filter(c => c.content?.id !== id)

    // localStorage.setItem("comments", JSON.stringify(newComments))

    const repliesFromLocalStorage = JSON.parse(localStorage.getItem("replies"))
    const newReplies = repliesFromLocalStorage.filter(r => r.commentRepliedToID !== id && r.userRepliedToID !== loggedInUser.id)

    // localStorage.setItem("replies", JSON.stringify(newReplies))

    closeModal()
}

const expandReplies = id => {
    const repliesContainer = document.getElementById(`replied-comments-${id}`)

    if (repliesContainer) {
        repliesContainer.classList.toggle("show-replies")
    }
}

const voteUp = id => {
    let voteEl = document.getElementById(`comment-${id}-votes`)
    currentVotes = +voteEl.innerText
    currentVotes++

    voteEl.innerText = currentVotes

    return currentVotes
}

const voteDown = id => {
    const voteEl = document.getElementById(`comment-${id}-votes`)

    let currentVotes = +voteEl.innerText

    if (currentVotes !== 0) {
        currentVotes--
    
        voteEl.innerText = currentVotes

        return currentVotes
    }
}

const createDeleteModal = (id) => {
    const overlay = document.createElement("div")
    const modal = document.createElement("div")

    overlay.className = "overlay"
    modal.className = "modal modal-delete"

    modal.innerHTML = `
        <div class="modal-header">
            <h3>Delete comment</h3>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-cancel" onclick=closeModal()>No, Cancel</button>
            <button class="btn btn-confirm" onclick=deleteComment(${id})>Yes, Delete</button>
        </div>
    `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)
}

const replyComment = e => {
    const commentToReply = e.target.parentElement.parentElement.parentElement
    const user = e.target.parentElement.firstChild.nextSibling.querySelector(".name").innerText
    const id = commentToReply.id.split("-")[2]

    const card = document.createElement("div")
    card.className = "card new-comment reply-comment"
    card.id = `reply-comment-${id}`

    card.innerHTML = `
        <div class="circle">
            <img src="../images/avatars/image-${loggedInUser.avatar}" />
        </div>
        <textarea id="reply-${id}" spellcheck="false" placeholder="Reply to ${user}..."></textarea>
        <button id="btn-reply-to-${id}" class="btn btn-reply-to" onclick="sendReply(event)">Reply</button>
    `

    commentToReply.after(card)
}

const sendReply = (e) => {
    e = e || window.event
    let target = e.target || e.srcElement

    target = target.parentElement.previousElementSibling

    const targetID = target.id.split("-")
    const userRepliedToID = +targetID[1]
    const commentRepliedToID = +targetID[2]

    const reply = document.getElementById(`reply-${commentRepliedToID}`)

    let arrayOfRepliesIDs = []
    let lastReplyID = null
    let newReplyID = null

    const repliesFromLocalStorage = JSON.parse(localStorage.getItem("replies"))

    repliesFromLocalStorage.forEach(r => {      

        if (r.replies.length === 0) {
            newReplyID = 1

        } else {
            r.replies.forEach(c => {
                arrayOfRepliesIDs.push(c.content.id)
            })
    
            lastReplyID = Math.max(...arrayOfRepliesIDs)
            newReplyID = lastReplyID + 1
        }
    })

    const replyComment = {
        user: {
            id: loggedInUser.id,
            username: loggedInUser.username,
            avatar: loggedInUser.avatar
        },
        content: {
            id: newReplyID,
            comment: reply.value,
            createdAt: "Now",
            votes: 0,
            repliesBy: []
        }
    }

    const commentReplies = {
        commentRepliedToID: newReplyID,
        userRepliedToID: loggedInUser.id,
        replies: []
    }

    const commentToAddReplyTo = repliesFromLocalStorage.filter(r => r.commentRepliedToID === commentRepliedToID && r.userRepliedToID === userRepliedToID)
    const restComments = repliesFromLocalStorage.filter(r => r.commentRepliedToID !== commentRepliedToID && r.userRepliedToID !== userRepliedToID)

    commentToAddReplyTo[0].replies.push(replyComment)
    const allReplies = [commentToAddReplyTo[0], ...restComments]
    localStorage.setItem("replies", JSON.stringify(allReplies))

    const replyComments = JSON.parse(localStorage.getItem("replies")) || [];
    replyComments.push(commentReplies)
    localStorage.setItem("replies", JSON.stringify(replyComments))
}

const closeModal = () => {
    document.querySelector(".overlay").remove()
}

const addComment = () => {
    const newComment = document.getElementById("comment")
    const commentsContainer = document.getElementById("comments")

    let arrayOfCommentsIDs = []
    let lastCommentID = null
    let newCommentID = null

    getData("../../comments.json")
    .then(data => {

        if (JSON.parse(localStorage.getItem("comments")).length === 0) {

            fillArray(data, arrayOfCommentsIDs)

            lastCommentID = Math.max(...arrayOfCommentsIDs)
            newCommentID = lastCommentID + 1

        } else {
            const allComments = JSON.parse(localStorage.getItem("comments"))

            allComments.forEach(c => {
                arrayOfCommentsIDs.push(c.content.id)

                lastCommentID = Math.max(...arrayOfCommentsIDs)
                newCommentID = lastCommentID + 1
            })
        }

        const comment = document.createElement("div")
        comment.id = `comment-${loggedInUser.id}-${newCommentID}`
        comment.className = "card comment-card"

        const numberOfLetters = newComment.value.split(" ").join("").length

        const commentData = {
            user: {
                id: loggedInUser.id,
                username: loggedInUser.username,
                avatar: loggedInUser.avatar
            },
            content: {
                id: newCommentID,
                comment: newComment.value,
                createdAt: "Now",
                votes: 0,
                repliesBy: []
            }
        }

        const commentReplies = {
            commentRepliedToID: newCommentID,
            userRepliedToID: loggedInUser.id,
            replies: []
        }
    
        comment.innerHTML = `
            <div class="button-group-vote">
                <button class="btn-vote-up" onclick=voteUp(${newCommentID})>
                    <img src="../images/icon-plus.svg" />
                </button>
                <span id="comment-${newCommentID}-votes">0</span>
                <button class="btn-vote-down" onclick=voteDown(${newCommentID})>
                    <img src="../images/icon-minus.svg" />
                </button>
            </div>
            <div class="comment">
                <div class="comment-header">
                    <div class="user-info">
                        <div class="circle">
                            <img src="../images/avatars/image-${loggedInUser.avatar}" />
                        </div>
                        <span class="name">${loggedInUser.username}</span>                   
                        <span class="you">you</span>
                        <span class="date">Now</span>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-delete" onclick=createDeleteModal(${newCommentID})><img src="../images/icon-delete.svg" />Delete</button>
                    </div>
                </div>
    
                <div class="comment-body">
                
                    <p contenteditable=true class="my-comment" spellcheck="false" onkeyup=editComment(${newCommentID})>${newComment.value}</p>

                    ${numberOfLetters > 130 ? 
                    
                        `<div class="popover">${newComment.value}</div>`
                    
                    : ""}
                </div>
            </div>
        `
    
        commentsContainer.appendChild(comment)

        newComment.value = ""

        const allComments = JSON.parse(localStorage.getItem("comments")) || [];
        allComments.push(commentData)

        localStorage.setItem("comments", JSON.stringify(allComments))

        const allReplies = JSON.parse(localStorage.getItem("replies")) || [];
        allReplies.push(commentReplies)

        localStorage.setItem("replies", JSON.stringify(allReplies))
    })
}

const editComment = (e, id) => {
    e = e || window.event
    let target = e.target || e.srcElement

    const comment = document.getElementById(`comment-${loggedInUser.id}-${id}`)
    const p = comment.querySelector(".comment-body p")
    const btnSave = comment.querySelector(".btn-save-changes")

    const commentsFromLocalStorage = JSON.parse(localStorage.getItem("comments"))
    const commentToEdit = commentsFromLocalStorage.filter(c => c.content.id === id)[0]
    const restComments = commentsFromLocalStorage.filter(c => c.content.id !== id)

    const repliesFromLocalStorage = JSON.parse(localStorage.getItem("replies"))

    if (commentToEdit) {
        if (p.textContent !== commentToEdit.content.comment) {
            btnSave.classList.add("show-save")
        } else {
            btnSave.classList.remove("show-save")
        }

        btnSave.addEventListener("click", () => {
            const editedComment = { ...commentToEdit, content: { ...commentToEdit.content, comment: p.textContent }}
    
            const newComments = [editedComment, ...restComments].sort((a, b) => a.content.id - b?.content?.id)
            localStorage.setItem("comments", JSON.stringify(newComments))
    
            btnSave.classList.remove("show-save")
        })

    } else {
        target = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling

        const targetID = target.id.split("-")
        const userID = +targetID[1]
        const commentID = +targetID[2]

        const commentRepliedTo = repliesFromLocalStorage.filter(r => r.commentRepliedToID === commentID && r.userRepliedToID === userID)
        const restComments = repliesFromLocalStorage.filter(r => r.commentRepliedToID !== commentID && r.userRepliedToID !== userID)
        const replyToEdit = commentRepliedTo[0].replies.filter(r => r.content.id === id)
        const restReplies = commentRepliedTo[0].replies.filter(r => r.content.id !== id)

        if (p.textContent !== replyToEdit[0].content.comment) {
            btnSave.classList.add("show-save")
        } else {
            btnSave.classList.remove("show-save")
        }

        const editedReply = { ...replyToEdit[0], content: { ...replyToEdit[0].content, comment: p.textContent }}
        const newReplies = [editedReply, ...restReplies]

        commentRepliedTo[0].replies.splice(0, commentRepliedTo[0].replies.length)
        commentRepliedTo[0].replies.push(...newReplies)

        const allReplies = [...commentRepliedTo, ...restComments]

        btnSave.addEventListener("click", () => {
            localStorage.setItem("replies", JSON.stringify(allReplies))
    
            btnSave.classList.remove("show-save")
        })
    }
}

const createTextarea = () => {
    const newComment = document.createElement("div")
    newComment.id = "new-comment"
    newComment.className = "card new-comment"

    newComment.innerHTML = `
    <div class="circle">
        <img src="../images/avatars/image-${loggedInUser.avatar}" />
    </div>
    <textarea id="comment" spellcheck="false" placeholder="Add a comment..."></textarea>
    <button id="btn-add-comment" class="btn btn-add">Add</button>
    `

    document.querySelector(".container").appendChild(newComment)
}



if  (JSON.parse(localStorage.getItem("comments")).length > 0) {

    const repliesData = JSON.parse(localStorage.getItem("replies"))
    
    const commentsData = JSON.parse(localStorage.getItem("comments"))

    drawComments(commentsData, repliesData)
}

if  (JSON.parse(localStorage.getItem("replies")).length > 0) {

    const commentsData = JSON.parse(localStorage.getItem("comments"))
    
    const repliesData = JSON.parse(localStorage.getItem("replies"))

    drawReplies(repliesData, commentsData)
}



createTextarea()



document.getElementById("btn-add-comment").addEventListener("click", addComment)

document.addEventListener("click", e => {

    if (e.target.classList.contains("btn-reply")) {
        replyComment(e)
    }
})