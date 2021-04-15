document.addEventListener('DOMContentLoaded',()=>{
    fetchQuotes()
    submitQuote()   
})

const qlsUrl = 'http://localhost:3000/quotes?_embed=likes'
// Populate page with quotes 
function fetchQuotes(){
    fetch(qlsUrl).then(resp=>resp.json())
    .then(quotes=> quotes.forEach(quote =>{
        renderQuote(quote);  
    }))
}

function renderQuote(quote){
    const quoteList = document.querySelector('#quote-list')
        const quoteItem = document.createElement('li')
            quoteItem.className = 'quote-card'
            quoteItem.id = `qc-${quote.id}`
            const quoteBlock = document.createElement('blockquote')
                quoteBlock.className = 'blockquote'
                const quotedLine = document.createElement('p')
                    quotedLine.className = 'mb-0'
                    quotedLine.innerText = quote.quote 
                const quoteFooter = document.createElement('footer')
                    quoteFooter.className = 'blockquote-footer'
                    quoteFooter.innerText = quote.author
                const quoteBr = document.createElement('br')
                const likeButton = document.createElement('button')
                    likeButton.className = 'btn-success'
                    likeButton.id = `likes-${quote.id}`
                    likeButton.innerHTML = `Like: <span>${quote.likes.length}</span>`
                    likeButton.addEventListener('click',(e)=>{
                        e.preventDefault()
                        likeQuote(quote)
                    })
                const deleteButton = document.createElement('button')
                    deleteButton.className = 'btn-danger'
                    deleteButton.innerText = 'Delete'
                    deleteButton.addEventListener('click',(e)=>{
                        e.preventDefault()
                        deleteQuote(quote)
                    })
                const editButton = document.createElement('button')
                    editButton.innerText = 'Edit'
                    editButton.addEventListener('click',(e)=>{
                        e.preventDefault()
                    })
            quoteBlock.append(quotedLine,quoteFooter,quoteBr,likeButton,deleteButton, editButton)
        quoteItem.append(quoteBlock)
    quoteList.append(quoteItem)
}

//form creates a new quote and adds it to the list of quotes without having to refresh the page
const quotesUrl = 'http://localhost:3000/quotes'

function submitQuote(){
    const quoteForm = document.querySelector('#new-quote-form')
        quoteForm.addEventListener('submit',(e)=>{
            e.preventDefault()
            const newQuote = {
                quote: e.target[0].value,
                author: e.target[1].value,
            }
            const configQuote = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body: JSON.stringify(newQuote)
            }
            fetch(quotesUrl,configQuote)
            .then(resp=>resp.json())
            .then(addedQuote=>{
                addedQuote,likes = []
                renderQuote(addedQuote)
            })  
        })
}
//Clicking the delete button should delete the respective quote from the API and remove it from the page
function deleteQuote(quote){
    const quoteCard = document.querySelector(`#qc-${quote.id}`)
    const configQuote={
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
    }
    fetch(`${quotesUrl}/${quote.id}`, configQuote)
    .then(resp=>resp.json())
    quoteCard.remove()   
}
//Clicking the like button will create a like for this particular quote
const likesUrl =  ' http://localhost:3000/likes'

function likeQuote(quote){
    const likeButton = document.querySelector(`#likes-${quote.id}`)
    console.log(likeButton)
    const newLike = {
        quoteId: quote.id,
        createdAt: Date.now()
    }
    console.log(newLike)
    const configLike ={
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify(newLike)
    }
    fetch(likesUrl,configLike)
    .then(resp=>resp.json())

    likeButton.innerHTML = ''
    likeButton.innerHTML = `Like: <span>${quote.likes.length +=1}</span>`
}


//add a createdAt key to your object to track when the like was created.

