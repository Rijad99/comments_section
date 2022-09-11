const loggedInUser = {
    id: 17,
    username: "juliusomo",
    avatar: "juliusomo.png"
}



if (JSON.parse(localStorage.getItem("comments")) === null) {
    localStorage.setItem("comments", JSON.stringify([]))
}



if  (JSON.parse(localStorage.getItem("comments")).length === 0) {

    getData("../../comments.json")
    .then(data => drawComments(data))

} else {

    getData("../../comments.json")
    .then(data => {
        const commentsFromLocalStorage = JSON.parse(localStorage.getItem("comments"))

        const allComments = [...data, ...commentsFromLocalStorage]

        drawComments(allComments)
    })
}



const drawComments = data => {
    const commentsContainer = document.getElementById("comments")

    data.forEach((d, i) => {

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
                                    <button class="btn btn-delete" onclick=deleteComment(${d.content.id})><img src="../images/icon-delete.svg" />Delete</button>
                            </div>
                        `

                    : `<button class="btn btn-reply"><img src="../images/icon-reply.svg" />Reply</button>`}    

                </div>

                <div class="comment-body">
                    <p>${d.content.comment}</p>
                    
                    ${numberOfLetters > 130 ? 
                    
                        `<div class="popover">${d.content.comment}</div>`
                    
                    : ""}

                </div>

                ${d.content.repliesBy.length > 0 ?           
                    `
                        <div class="comment-footer">
                            <div class="replies">
                                
                                ${
                                    d.content.repliesBy.length > 2 
                                    ?           
                                    (d.content.repliesBy.slice(0, 2).join(", ") + " and " + d.content.repliesBy.slice(2, d.content.repliesBy.length).length + " others replied to this comment.") 
                                    : 
                                    d.content.repliesBy.length === 1 ? (d.content.repliesBy + " replied to this comment.") : d.content.repliesBy.length === 2 
                                    && 
                                    (d.content.repliesBy.join(" & ") + " replied to this comment.")}

                            </div>

                            ${d.replies?.length > 0 ?
                            
                                `<button id="btn-expand" class="btn btn-expand" onclick=expandReplies(${d.content.id})>Expand</button>`

                            : ""}
                            
                        </div>
                    `
                    : ""}
            </div>
        `

        commentsContainer.appendChild(comment)

        const repliedCommentsContainer = d.replies && document.createElement("div")

        d.replies?.forEach(reply => {
            const repliedComment = document.createElement("div")
            repliedComment.id = `comment-${loggedInUser.id}-${reply.content.id}`
            repliedComment.className = "card comment-card"

            const numberOfLetters = reply.content.comment.split(" ").join("").length

            repliedComment.innerHTML = `
                <div class="button-group-vote">
                    <button class="btn-vote-up" onclick=voteUp(${reply.content.id})>
                        <img src="../images/icon-plus.svg" />
                    </button>
                    <span id="comment-${reply.content.id}-votes">${reply.content.votes}</span>
                    <button class="btn-vote-up" onclick=voteDown(${reply.content.id})>
                        <img src="../images/icon-minus.svg" />
                    </button>
                </div>
                <div class="comment">
                    <div class="comment-header">
                        <div class="user-info">
                            <div class="circle">
                                <img src="../images/avatars/image-${reply.user.avatar}" />
                            </div>
                            <span class="name">${reply.user.username}</span>
                            
                            ${reply.user.id === loggedInUser.id ?
                            
                                `<span class="you">you</span>`
                            
                            : ""}

                            <span class="date">${reply.content.createdAt}</span>
                        </div>

                        ${reply.user.id === loggedInUser.id ?
                        
                            `
                                <div class="button-group">
                                        <button class="btn btn-delete" onclick=deleteComment(${reply.content.id})><img src="../images/icon-delete.svg" />Delete</button>
                                </div>
                            `

                        : `<button class="btn btn-reply"><img src="../images/icon-reply.svg" />Reply</button>`}       
                                         
                    </div>

                    <div class="comment-body">
                        <p>${reply.content.comment}</p>

                        ${numberOfLetters > 130 ? 
                    
                            `<div class="popover">${d.content.comment}</div>`
                        
                        : ""}

                    </div>
                </div>
            `

            if (repliedCommentsContainer) {
                repliedCommentsContainer.id = `replied-comments-${d.content.id}`
                repliedCommentsContainer.className = "replied-comments"
    
                repliedCommentsContainer.appendChild(repliedComment)
            }
        
            if (repliedCommentsContainer) {
                comment.after(repliedCommentsContainer)
            }
        })
    })
}



const deleteComment = id => {
    const comment = document.getElementById(`comment-${loggedInUser.id}-${id}`)

    comment.remove()

    const commentsFromLocalStorage = JSON.parse(localStorage.getItem("comments"))
    const newComments = commentsFromLocalStorage.filter(c => c.content?.id !== id)

    localStorage.setItem("comments", JSON.stringify(newComments))
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
                id: 17,
                username: "juliusomo",
                avatar: "juliusomo.png"
            },
            content: {
                id: newCommentID,
                comment: newComment.value,
                createdAt: "Now",
                votes: 0,
                repliesBy: []
            }
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
                        <button class="btn btn-delete" onclick=deleteComment(${newCommentID})><img src="../images/icon-delete.svg" />Delete</button>
                    </div>
                </div>
    
                <div class="comment-body">
                    <p>${newComment.value}</p>

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
    })
}



document.getElementById("btn-add-comment").addEventListener("click", addComment)