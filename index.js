import { tweetsData, modifyTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

if (localStorage.getItem("tweets")){
       // parse data stored in local storage to new variable
    let localTweetsData = JSON.parse(localStorage.getItem("tweets") );
    // overwrite original data array with data from parsed data using imported function 
    modifyTweetsData(localTweetsData)
    render()   
}

// detect user click event after initial render 
document.addEventListener('click', function(e){

// test event data to determine type of element intialized 
    if(e.target.dataset.like){
 //pass the parent object uuid attribute stored within the clicked element to next function
       handleLikeClick(e.target.dataset.like)
    
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        getReplyValue(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }    
    else if(e.target.dataset.setting){
        handleSettingClick(e.target.dataset.setting)
    }
})

// run function using uuid from intial user click
function handleLikeClick(tweetId){ 
    // create new array using filter that  only contains object with matching uuid 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    // check the state of the liked button
    // if the state is already liked, minus like count by 1
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    // else, incrase like count by 1
    else{
        targetTweetObj.likes++ 
    }
    // flip liked state 
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    // render modified data
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    // toggle the hidden class property on reply-section html when reply icon is clicked
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleSettingClick(SettingId){
    // modify css to display setting modal when setting icon is clicked
    document.getElementById(`setting-${SettingId}`).style.display = "inline"
    // pass object uuid to function that will handle additional clicks
    handleSettingOptionClick(SettingId)       
}

function handleSettingOptionClick(optionId){
    handleDeleteClick(optionId)
}

function handleDeleteClick(deleteId){
    // take control of delete div with approrpiate uuid using id selector
    let deleteBtn = document.getElementById(`delete-btn-${deleteId}`)
    // listen for click on delete button
        deleteBtn.addEventListener('click', function(){
            let filteredTweets = tweetsData.filter((tweet, index) => {
                // create new array which does not include object with said uuid
                return (tweet.uuid != deleteId)
            })       
            // update new array to original data variable then renders
            modifyTweetsData(filteredTweets)
            render()
            
        })   
}


function checkExistingReplies(){
    // nest forEach loop to find objects which contains username (@scrimba)  
    tweetsData.forEach(function(tweet){
        tweet.replies.forEach(function(tweetReplies){
            let commentIconClass = ''
            
            // check the reply array for user handle, @Scrimba  
            if(tweetReplies.handle === `@Scrimba`){
            // if user handle is found in replies array, change state true for styling
                tweet.isCommented = true
            
            // apply conditional styling for reply icon which has existing user replies
            if(tweet.isCommented){
                commentIconClass = 'commented'
            }
            }
        })
    })
}



function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isCommented: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    localStorage.setItem("tweets", JSON.stringify(tweetsData))
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        // if user handle exists in the replies of another object, apply conditional styling
        let commentIconClass = ''
        if (tweet.isCommented){
            commentIconClass = 'commented'
        }
        
 
        
        let repliesHtml = ''
        if(tweet.replies){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
            
            repliesHtml += 
            // reply input area  
            `
            <hr>
            <br>
            <div class="tweet-input-area">
			<img src="images/scrimbalogo.png" class="profile-pic">
			<textarea placeholder="What's happening?" id="reply-input-${tweet.uuid}"></textarea>
		</div>
		<button id="reply-btn-${tweet.uuid}">Reply</button>
            `
        }
        
        // setting display menu
        
        let settingHtml = `
                <div class = "setting-display" data-setting="${tweet.uuid}">
                
                    <div class= "delete-container highlight" id="delete-btn-${tweet.uuid}" data-delete = "${tweet.uuid}"> 
                        <i class="fa-solid fa-trash-can delete-icon"></i>
                        <p class="setting-text">Delete</p>
                    </div>
                    
                    <div class = "highlight">
                        <i class="fa-solid fa-thumbtack setting-icon"></i>
                       <p class="setting-text">Pin to your profile</p>
                    </div>
                    
                    <div  class ="highlight">
                      <i class="fa-solid fa-file-circle-plus setting-icon"></i>
                        <p class="setting-text">Change who can reply</p>
                    </div>
                    
                    <div class ="highlight">
                        <i class="fa-solid fa-code setting-icon"></i>
                        <p class="setting-text">Embed Tweet</p>
                    </div>
                    
                    <div class ="highlight">
                        <i class="fa-solid fa-chart-line setting-icon"></i>
                        <p class="setting-text">View Tweet analytics</p>
                    </div>              
                    
                </div>
                `
        
            
        // rendering existing feed 
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <i class="fa-solid fa-ellipsis" ${commentIconClass}" 
                        data-setting="${tweet.uuid}"></i>
                    <div class="hidden setting-element" id="setting-${tweet.uuid}">
                       ${settingHtml}
                    </div>
                                        
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots ${commentIconClass}"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                        <br>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>

        `
   })
   
    //create key to store the rendered data to local storage      
   localStorage.setItem("tweets", JSON.stringify(tweetsData))      
   return feedHtml


   
}

function getReplyValue(replyId){
    // take control of textbox
    // take control of reply btn 
    // add text input to the the appropriate object array
    
    const replyText = document.getElementById(`reply-input-${replyId}`)
    const replyBtn = document.getElementById(`reply-btn-${replyId}`)
    
    replyBtn.addEventListener('click', function(){
        if (replyText.value){
            tweetsData.forEach(function(tweet){
                if (tweet.uuid === replyId){
                    tweet.replies.push({
                    handle: `@Scrimba`,
                    profilePic: `images/scrimbalogo.png`,
                    tweetText: replyText.value,
                    })
                }
             })
            checkExistingReplies()
            render()
            
        } 
    }

)}
    
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
